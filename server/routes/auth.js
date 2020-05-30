const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')

router.get('/user', auth.authenticate, function (req, res) {
  res.status(200).json(req.user)
})

router.post('/refresh', auth.refresh)

router.post('/login', async function (req, res) {
  try {
    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({
      $or: [
        { email },
        { username: email }
      ]
    })

    if (user) {
      if (user.validatePassword(password)) {
        const token = await auth.generateToken(user)

        res.status(200).json(token)
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
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.post('/change-password', auth.authenticate, async function (req, res) {
  try {
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
      const user = await User.findById(req.user._id)

      if (user.validatePassword(currentPassword)) {
        user.setPassword(newPassword)

        const saved = await user.save()

        res.status(200).json({
          message: 'Password updated successfully.'
        })
      } else {
        res.status(403).json({
          message: 'You must specify the correct current password to change your password.'
        })
      }
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

module.exports = router
