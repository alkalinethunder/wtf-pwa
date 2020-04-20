const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')

router.get('/user', auth.authenticate, function (req, res) {
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

router.post('/change-password', auth.authenticate, function (req, res) {
  const currentPassword = req.body.password
  const newPassword = req.body.newPassword
  const confirm = req.body.confirm

  if (!currentPassword) {
    res.status(400).json({
      message: 'Password is required.'
    })
  } else if (!newPassword) {
    res.status(400).json({
      message: 'New password is required.'
    })
  } else if (!confirm) {
    res.status(400).json({
      message: 'Confirmed new password is required.'
    })
  } else if (newPassword !== confirm) {
    res.status(500).json({
      message: 'Passwords do not match.'
    })
  } else if (newPassword === currentPassword) {
    res.status(400).json({
      message: 'New password cannot be the same as current password.'
    })
  } else {
    User.findById(user._id).exec(function (err, user) {
      if (err) {
        res.status(500).json({
          message: err.message
        })
      } else if (user) {
        if (user.validatePassword(currentPassword)) {
          user.setPassword(newPassword)
          user.save(function (err, saved) {
            if (err) {
              res.status(500).json({
                message: err.message
              })
            } else if (saved) {
              res.status(200).json({
                message: 'Password updated successfully.'
              })
            } else {
              res.status(500).json({
                message: 'Unknown error occurred.'
              })
            }
          })
        } else {
          res.status(403).json({
            message: 'You must specify the correct current password to change your password.'
          })
        }
      } else {
        res.status(401).json({
          message: 'User not found.'
        })
      }
    })
  }
})

module.exports = router
