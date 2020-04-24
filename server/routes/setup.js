const express = require('express')
const router = express.Router()
const SiteSetting = require('../models/sitesetting')
const auth = require('../middleware/auth')
const User = require('../models/user')

router.get('/configure', function (req, res) {
  User.findOne({
    owner: true
  }).exec(function (err, user) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else {
      SiteSetting.findOne({}).exec(function (err, settings) {
        if (err) {
          res.status(500).json({
            message: err.message
          })
        } else {
          res.status(200).json({
            settings,
            done: !!user
          })
        }
      })
    }
  })
})

router.post('/configure', function (req, res) {
  User.findOne({ owner: true }).exec((err, owner) => {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (owner) {
      res.status(400).json({
        message: 'The CMS has already been configured.  You do not need to create a new owner account.  If you are the owner and would like to pass ownership to a new user or change site configuration, you may do so in the Administration Panel.'
      })
    } else {
      const admin = req.body.admin

      if (admin) {
        const { username, email, emailConfirm, password, passwordConfirm } = admin

        if (!!username && !!email && !!password) {
          if (email === emailConfirm) {
            if (password === passwordConfirm) {
              User.findOne({
                $or: [
                  { username },
                  { email }
                ]
              }).exec(function (err, exists) {
                if (err) {
                  res.status(500).json({
                    message: err.message
                  })
                } else if (exists) {
                  res.status(401).json({
                    message: 'A user with that username or email already somehow exists.'
                  })
                } else {
                  const user = new User({
                    username,
                    email,
                    owner: true,
                    joined: new Date(),
                  })

                  user.setPassword(password)

                  user.save(function (err, saved) {
                    if (err) {
                      res.status(500).json({
                        message: err.message
                      })
                    } else if (saved) {
                      res.status(200).json({
                        done: true
                      })
                    } else {
                      res.status(500).json({
                        message: 'An unspecified error has occurred.'
                      })
                    }
                  })
                }
              })
            } else {
              res.status(400).json({
                message: 'A matching passwordConfirm field is required for the admin password.'
              })
            }
          } else {
            res.status(400).json({
              message: 'A matching emailConfirm field is required for the admin email.'
            })
          }
        } else {
          res.status(400).json({
            message: 'Admin username, email and password fields are required.'
          })
        }
      } else {
        res.status(400).json({
          message: 'Administrator account is required in admin field.'
        })
      }
    }
  })
})

router.post('/configure/misc', auth.owner, function (req, res) {
  const requestedChanges = {
    devCredit: !!req.body.devCredit,
    devLink: !!req.body.devLink,
    errorCats: !!req.body.errorCats
  }

  SiteSetting.findOne({}).exec(function (err, settings) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (settings) {
      settings.showDeveloperCredit = requestedChanges.devCredit
      settings.developerGitHubLinkInCredit = requestedChanges.devLink
      settings.httpStatusCodeCats = requestedChanges.errorCats

      settings.save(function (err, saved) {
        if (err) {
          res.status(500).json({
            message: err.message
          })
        } else {
          res.status(200).json(saved)
        }
      })
    } else {
      res.status(500).json({
        message: 'Site settings were not found in the database.'
      })
    }
  })
})

module.exports = router
