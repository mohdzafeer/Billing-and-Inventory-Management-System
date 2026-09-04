const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const auth = require('../middleware/auth')
const { sendInvitation } = require('../utils/email')

router.use(auth)

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

// Get all members of the org
router.get('/', async (req, res) => {
  try {
    const members = await User.find({
      orgId: req.user.orgId,
      role: 'member',
    }).select('email organizationName role createdAt').sort({ createdAt: -1 })
    res.json(members)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add a new member (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'A user with this email already exists' })
    }

    const admin = await User.findById(req.user.id).select('organizationName')
    const hashed = await bcrypt.hash(password, 10)

    const member = await User.create({
      organizationName: admin.organizationName,
      email,
      password: hashed,
      role: 'member',
      orgId: req.user.orgId,
    })

    let emailSent = false
    let emailError = null
    try {
      await sendInvitation({ to: email, orgName: admin.organizationName, password })
      emailSent = true
    } catch (err) {
      emailError = err.message
    }

    res.status(201).json({
      member: { _id: member._id, email: member.email, role: member.role, createdAt: member.createdAt },
      emailSent,
      emailError,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Remove a member (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const member = await User.findOneAndDelete({
      _id: req.params.id,
      orgId: req.user.orgId,
      role: 'member',
    })
    if (!member) return res.status(404).json({ message: 'Member not found' })
    res.json({ message: 'Member removed' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
