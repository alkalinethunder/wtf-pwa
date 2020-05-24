const mongoose = require('mongoose');

const { Schema } = mongoose;

require('./category')
require('./user')

const PostSchema = new Schema({
  name: String,
  slug: String,
  created: { type: Date, required: true },
  excerpt: String,
  body: String,
  views: { type: Number, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'category', default: null },
  tags: [{ type: String }],
  featuredUrl: { type: String, required: false, default: null },
  author: { type: Schema.Types.ObjectId, required: false, ref: 'user' }
})

module.exports = mongoose.model('post', PostSchema)
