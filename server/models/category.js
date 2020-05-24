const mongoose = require('mongoose')

const { Schema } = mongoose

const CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  system: { type: Boolean, required: true, default: false }
})

module.exports = mongoose.model('category', CategorySchema)
