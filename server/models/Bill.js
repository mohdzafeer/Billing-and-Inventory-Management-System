const mongoose = require('mongoose')

const billSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true },
    customerName: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    customerAddress: { type: String, default: '' },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Bill', billSchema)
