const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')

router.get('/', auth.authenticate, function (req, res) {
  res.status(200).json(req.user)
})

router.post('/refresh', auth.refresh)

router.post('/login', function (req, res) {
  const email = req.body.email
  const password = req.body.password

  User.findOne({ email }).exec(function (err, user) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (user) {
      if (user.validatePassword(password)) {
        auth.generateToken(user, function (err, token) {
          if (err) {
            res.status(500).json({
              message: err.message
            })
          } else {
            res.status(200).json({
              ...token,
              user
            })
          }
        })
      } else {
        res.status(401).json({
          message: 'The given password is invalid. Please try again.'
        })
      }
    } else {
      res.status(401).json({
        message: 'A user with this email address does not exist.'
      })
    }
  })
})

module.exports = router
