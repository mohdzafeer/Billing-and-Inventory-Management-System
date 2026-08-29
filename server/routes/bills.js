const express = require('express')
const router = express.Router()
const Bill = require('../models/Bill')
const auth = require('../middleware/auth')

router.use(auth)

// Get all bills for logged-in user
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(bills)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create bill
router.post('/', async (req, res) => {
  try {
    const { invoiceNo, customerName, customerPhone, customerAddress, items, subtotal, total } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' })
    }

    const bill = await Bill.create({
      invoiceNo,
      customerName,
      customerPhone,
      customerAddress,
      items,
      subtotal,
      total,
      user: req.user.id,
    })

    res.status(201).json(bill)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
