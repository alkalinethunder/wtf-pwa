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

router.post('/', async function (req, res) {
  /* const reqBody = {
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
  } */

  try {
    // Form data
    const {
      email,
      username,
      password,
      confirmPassword,
      confirmEmail
    } = req.body

    // Ensure we have an email in the form data
    if (!email) {
      return res.status(400).json({
        message: 'Email is required.'
      })
    }

    // Ensure we have a username in the form data
    if (!username) {
      return res.status(400).json({
        message: 'Username is required.'
      })
    }

    // Ensure we have a password in the form data
    if (!password) {
      return res.status(400).json({
        message: 'Password is required.'
      })
    }

    // Measure the strength of the specified password.  It'll return an object with a 'value' and 'id',
    // 'id' is a number that tells us how strong the password is.  'id' of 2 = strong enough to feasibly use without
    // getting hacked immediately.
    if (passwordStrength(password).id < 2) {
      return res.status(400).json({
        message: 'Password is too weak.'
      })
    }

    // This regex should work for MOST emasil addresses.
    const emailRegex = /^([\w\.]+)@([\w\-]+)(\.[\w\.\-]{2,63})$/

    // This one is for validating usernames.
    const usernameRegex = /^([A-z0-9\-_]+)$/

    // Ensure that usernames are only alphanumeric with hyphens or underscores.
    // This is the same limitation imposed in the frontend's markdown renderer for @mentions.
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: 'Username contains invalid characters.'
      })
    }

    // This is just a sanity check, eventually I'll validate emails with an actual confirmation
    // message sent to the inbox over SMTP.  But that's hard.
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Email must be a valid email address format.'
      })
    }

    // Now we can check if the user's entered the same email twice for further validation.
    if (email !== confirmEmail) {
      return res.status(400).json({
        message: 'Email addresses do not match.'
      })
    }

    // And do the same for passwords.
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match.'
      })
    }

    // Try to find an existing user with the given email or username....
    const existingUser = await User.findOne({
      $or: [
        { email },
        { username }
      ]
    })

    // And if we do get an existing user, then we can't register this account since someone
    // else has it.  This weirdness gives the user a different error message based on whether it was
    // the email that was taken or the username (which is kinda handy to know :P)
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(403).json({
          message: 'Username is taken by another user.'
        })
      } else if (existingUser.email === email) {
        return res.status(403).json({
          message: 'Email address is taken by another user.'
        })
      }
    }

    // Create a new user with the given user and email that's just joined now.
    const user = new User({
      email,
      username,
      joined: new Date()
    })

    // Set the password, this creates a unique salt each time and hashes the password with it.
    // Resulting hash and salt are stored in the DB, we don't ever save the password itself.
    //
    // Relevent Tom Scott video: https://youtu.be/8ZtInClXe1Q
    //
    // That video recommends not doing this at all and just letting an OAuth provider do this shit...
    // but that's hard.
    user.setPassword(password)

    // Save the new user to the DB.
    const saved = await user.save()

    // Give the user to the client.
    res.status(200).json(saved)
  } catch (err) {
    res.status(500).json({
      message: err.message
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
