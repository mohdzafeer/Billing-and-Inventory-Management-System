const express = require('express')
const router = express.Router()
const Settings = require('../models/Settings')
const auth = require('../middleware/auth')

router.use(auth)

// Get settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.user.id })
    if (!settings) {
      settings = await Settings.create({ user: req.user.id })
    }
    res.json(settings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update settings
router.put('/', async (req, res) => {
  try {
    const { name, tagline, address, phone, email, ownerName, logo } = req.body

    const settings = await Settings.findOneAndUpdate(
      { user: req.user.id },
      { name, tagline, address, phone, email, ownerName, logo },
      { new: true, upsert: true }
    )

    res.json(settings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
