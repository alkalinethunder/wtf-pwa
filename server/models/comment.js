const mongoose = require('mongoose')
const User = require('./user')

const { Schema } = mongoose

const CommentSchema = new Schema({
  commentType: { type: String, required: true },
  posted: { type: Date, required: true },
  body: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  belongsTo: { type: Schema.Types.ObjectId, required: true }
})

module.exports = mongoose.model('comment', CommentSchema)
