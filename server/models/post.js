const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  name: String,
  slug: String,
  created: { type: Date, required: true },
  excerpt: String,
  body: String,
  views: { type: Number, default: 0 },
  category: { type: String, default: null },
  tags: [{ type: String }],
  featuredUrl: { type: String, required: false, default: null }
})

module.exports = mongoose.model('post', PostSchema)
