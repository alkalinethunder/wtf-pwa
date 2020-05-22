const mongoose = require('mongoose')

const { Schema } = mongoose

const MenuItemSchema = new Schema({
  name: { type: String, required: true },
  href: { type: String, required: false },
  page:  { type: String, required: false },
  post: { type: String, required: false },
  type: { type: String, required: true },
  slot: { type: String, required: false }
})

module.exports = mongoose.model('menuitem', MenuItemSchema)
