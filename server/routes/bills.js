const express = require('express')
const router = express.Router()
const Bill = require('../models/Bill')
const Product = require('../models/Product')
const auth = require('../middleware/auth')
const { getCache, setCache, delCache } = require('../utils/cache')

router.use(auth)

const billsKey = (orgId) => `bills:${orgId}`
const productsKey = (orgId) => `products:${orgId}`

// Get all bills for the org
router.get('/', async (req, res) => {
  try {
    const key = billsKey(req.user.orgId)
    const cached = await getCache(key)
    if (cached) return res.json(cached)

    const bills = await Bill.find({ user: req.user.orgId }).sort({ createdAt: -1 })
    await setCache(key, bills)
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
      user: req.user.orgId,
    })

    // Deduct sold quantities from inventory
    const deductions = items.filter(i => i.productId)
    await Promise.all(deductions.map(item =>
      Product.findOneAndUpdate(
        { _id: item.productId, user: req.user.orgId },
        { $inc: { quantity: -item.qty } }
      )
    ))

    // Invalidate both bills and products caches since inventory changed
    await delCache(billsKey(req.user.orgId), productsKey(req.user.orgId))

    res.status(201).json(bill)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
