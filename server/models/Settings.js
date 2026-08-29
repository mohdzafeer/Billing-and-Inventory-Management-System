const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, default: '' },
    tagline: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    ownerName: { type: String, default: '' },
    logo: { type: String, default: null },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Settings', settingsSchema)
