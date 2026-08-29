const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const auth = require('../middleware/auth')

router.use(auth)

// Get all products for logged-in user
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).sort({ createdAt: -1 })
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
      name, category, price, quantity, unit, user: req.user.id,
    })

    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    if (!product) return res.status(404).json({ message: 'Product not found' })
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
      { _id: req.params.id, user: req.user.id },
      { name, category, price, quantity, unit },
      { new: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
