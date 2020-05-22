const mongoose = require('mongoose')

const { Schema } = mongoose

const PageSchema = new Schema({
  slug: { type: String, required: true },
  name: { type: String, required: true },
  body: String,
  system: { type: Boolean, required: true, default: false },
  created: { type: Date, required: true },
  edited: { type: Date, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'page', required: false, default: null }
})

module.exports = mongoose.model('page', PageSchema)
