const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const auth = require('../middleware/auth')
const { getCache, setCache, delCache } = require('../utils/cache')

router.use(auth)

const cacheKey = (orgId) => `products:${orgId}`

// Get all products for the org
router.get('/', async (req, res) => {
  try {
    const key = cacheKey(req.user.orgId)
    const cached = await getCache(key)
    if (cached) return res.json(cached)

    const products = await Product.find({ user: req.user.orgId }).sort({ createdAt: -1 })
    await setCache(key, products)
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add product
router.post('/', async (req, res) => {
  try {
    const { name, category, price, quantity, unit } = req.body

    if (!name || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: 'Name, price, and quantity are required' })
    }

    const product = await Product.create({
      name, category, price, quantity, unit, user: req.user.orgId,
    })

    await delCache(cacheKey(req.user.orgId))
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user.orgId })
    if (!product) return res.status(404).json({ message: 'Product not found' })

    await delCache(cacheKey(req.user.orgId))
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { name, category, price, quantity, unit } = req.body
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user.orgId },
      { name, category, price, quantity, unit },
      { new: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })

    await delCache(cacheKey(req.user.orgId))
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
