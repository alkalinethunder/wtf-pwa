const mongoose = require('mongoose')

const { Schema } = mongoose

const MenuItemSchema = new Schema({
  title: { type: String, required: true },
  to: { type: String, required: false },
  href: { type: String, required: false },
  item_type: { type: String, required: true },
  menu_slot: { type: String, required: false }
})

module.exports = mongoose.model('menuitem', MenuItemSchema)
