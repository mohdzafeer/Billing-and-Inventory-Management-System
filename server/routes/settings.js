const express = require('express')
const router = express.Router()
const Settings = require('../models/Settings')
const auth = require('../middleware/auth')

router.use(auth)

// Get org settings (shared across all org members)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.user.orgId })
    if (!settings) {
      settings = await Settings.create({ user: req.user.orgId })
    }
    res.json(settings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update settings (admin only)
router.put('/', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update settings' })
    }

    const { name, tagline, address, phone, email, ownerName, logo } = req.body

    const settings = await Settings.findOneAndUpdate(
      { user: req.user.orgId },
      { name, tagline, address, phone, email, ownerName, logo },
      { new: true, upsert: true }
    )

    res.json(settings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
