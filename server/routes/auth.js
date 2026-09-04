const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Settings = require('../models/Settings')
const auth = require('../middleware/auth')

// Register (creates an admin account)
router.post('/register', async (req, res) => {
  try {
    const { organizationName, email, password } = req.body

    if (!organizationName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Email is already registered' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({
      organizationName, email, password: hashed, role: 'admin',
    })

    await Settings.create({ user: user._id, name: organizationName })

    const token = jwt.sign(
      { id: user._id, orgId: user._id.toString(), role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: { id: user._id, organizationName: user.organizationName, email: user.email, role: 'admin' },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const orgId = (user.orgId || user._id).toString()
    const role = user.role || 'admin'

    const token = jwt.sign(
      { id: user._id, orgId, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: { id: user._id, organizationName: user.organizationName, email: user.email, role },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get current user info (used on page reload to restore role)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('organizationName email role')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ id: user._id, organizationName: user.organizationName, email: user.email, role: req.user.role })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
