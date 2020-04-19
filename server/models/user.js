const mongoose = require('mongoose')
const crypto = require('crypto')
const ITERATIONS = 1000
const KEY_LENGTH = 64
const { Schema } = mongoose

const UserSchema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  displayName: { type: String, required: false, default: '' },
  joined: { type: Date, required: true },
  about: { type: String, required: false, default: '' },
  avatar: { type: String, required: false, default: '' },
  salt: { type: String, required: true, private: true },
  hash: { type: String, required: true, private: true }
})

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(64).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, ITERATIONS, KEY_LENGTH, 'sha512').toString('hex')
}

UserSchema.methods.validatePassword = function (password) {
  const requestedHash = crypto.pbkdf2Sync(password, this.salt, ITERATIONS, KEY_LENGTH, 'sha512').toString('hex')
  return this.hash === requestedHash
}

module.exports = mongoose.model('user', UserSchema)
