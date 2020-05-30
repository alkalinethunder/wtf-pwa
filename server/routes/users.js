const passwordStrength = require('check-password-strength')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const upload = require('../middleware/upload')

router.get('/', function (req, res) {
  User.find().exec(function (err, users) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else {
      res.status(200).json(users)
    }
  })
})

router.post('/', function (req, res) {
  const reqBody = {
    username: req.body.username,
    email: req.body.email,
    emailConfirm: req.body.confirmEmail,
    password: req.body.password,
    passwordConfirm: req.body.confirmPassword
  }

  if (reqBody.username) {
    if (reqBody.email && reqBody.email === reqBody.emailConfirm) {
      if (reqBody.password && reqBody.password === reqBody.passwordConfirm) {
        if (passwordStrength(reqBody.password) < 2) {
          return res.status(401).json({
            message: 'Password is too weak.'
          })
        }

        User.findOne({
          $or: [
            {
              username: reqBody.username
            },
            {
              email: reqBody.email
            }
          ]
        }).exec(function (err, existingUser) {
          if (err) {
            res.status(500).json({
              message: err.message
            })
          } else if (existingUser) {
            if (existingUser.username == reqBody.username) {
              res.status(403).json({
                message: 'Username already taken by another user.'
              })
            } else if(existingUser.email === email) {
              res.status(403).json({
                message: 'Email already registered by another user.'
              })
            }
          } else {
            const newUser = new User({
              email: reqBody.email,
              username: reqBody.username,
              joined: new Date(),
              content: ''
            })

            newUser.setPassword(reqBody.password)

            newUser.save(function (err, user) {
              if (err) {
                res.status(500).json({
                  message: err.message
                })
              } else {
                auth.generateToken(user, function (err, token) {
                  if (err) {
                    res.status(500).json({
                      message: err.message
                    })
                  } else {
                    res.status(200).json(token)
                  }
                })
              }
            })
          }
        })
      } else {
        res.status(400).json({
          message: 'Please specify two matching passwords.'
        })
      }
    } else {
      res.status(400).json({
        message: 'Please specify two matching email addresses.'
      })
    }
  } else {
    res.status(400).json({
      message: 'A username is required.'
    })
  }
})

router.get('/username/:username', function (req, res) {
  User.findOne({ username: req.params.username }).exec(function (err, user) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (user) {
      res.status(200).json(user.toJSON())
    } else {
      res.status(404).json({
        message: 'User not found.'
      })
    }
  })
})

router.get('/id/:id', function (req, res) {
  User.findById(req.params.id).exec(function (err, user) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (user) {
      res.status(200).json(user.toJSON())
    } else {
      res.status(404).json({
        message: 'User not found.'
      })
    }
  })
})

router.post('/profile/:id', auth.authenticate, async function (req, res) {
  try {
    const user = await User.findById(req.params.id)

    if (user) {
      const hasPermission = (req.user._id === user._id || req.user.owner || req.user.admin)
      if (hasPermission) {
        user.displayName = req.body.displayName || ''
        user.about = req.body.about || ''
        user.content=  req.body.content || ''

        const saved = await user.save()

        res.status(200).json(saved)
      } else {
        res.status(401).json({
          message: "Only owners, administrators, or the user themselves can edit a user's profile."
        })
      }
    } else {
      return res.status(404).json({
        message: 'User not found.'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.post('/avatar/:id', auth.authenticate, upload.single('file'), async function (req, res) {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      if (user._id === req.user._id || req.user.owner || req.user.admin) {
        user.avatar = `/avatars/${req.file.filename}`
        await user.save()
        res.status(200).json({
          url: user.avatar
        })
      } else {
        res.status(403).json({
          message: 'Only site owners, administrators, and the user theirself can upload a new avatar for a user.'
        })
      }
    } else {
      res.status(404).json({
        message: 'User not found.'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.post('/cover/:id', auth.authenticate, upload.single('file'), async function (req, res) {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      if (user._id === req.user._id || req.user.owner || req.user.admin) {
        user.cover = `/covers/${req.file.filename}`
        await user.save()
        res.status(200).json({
          url: user.cover
        })
      } else {
        res.status(403).json({
          message: 'Only site owners, administrators, and the user theirself can upload a new cover image for a user.'
        })
      }
    } else {
      res.status(404).json({
        message: 'User not found.'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

module.exports = router
