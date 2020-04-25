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

router.post('/configure/socials', auth.owner, function (req, res) {
  const { twitter, youtube, reddit, github } = req.body

  if (twitter && twitter.length > 15) {
    res.status(400).json({
      message: 'Twitter username is too long.'
    })
  } else if (twitter && !twitter.match(/^[A-z0-9_]+$/i)) {
    res.status(400).json({
      message: 'Twitter username contains invalid characters.'
    })
  } else if (youtube && !youtube.match(/^youtube\.com\/(user|channel)\/([A-z0-9\-_]+$)/)) {
    res.status(400).json({
      message: 'YouTube channel URL is not valid.'
    })
  } else if (reddit && !reddit.match(/^[A-z0-9\-_]+$/i)) {
    res.status(400).json({
      message: 'Subreddit name is not valid.'
    })
  } else if (github && !github.match(/^[A-z0-9\-_]+$/i)) {
    res.status(400).json({
      message: 'GitHub username is not valid.'
    })
  } else {
    SiteSetting.findOne({}).exec(function (err, settings) {
      if (err) {
        res.status(500).json({
          message: err.message
        })
      } else if (settings) {
        settings.twitterHandle = twitter ? `https://twitter.com/${twitter}` : null
        settings.youtubeChannel = youtube ? `https://www.${youtube}` : null
        settings.subreddit = reddit ? `https://reddit.com/r/${reddit}` : null
        settings.githubProfile = github ? `https://github.com/${github}` : null

        settings.save(function (err, saved) {
          if (err) {
            res.status(500).json({
              message: err.message
            })
          } else if (saved) {
            res.status(200).json(saved)
          }
        })
      }
    })
  }
})

router.post('/configure/sitename', auth.owner, function (req, res) {
  const requestedChanges = {
    name: req.body.name && req.body.name.trim(),
    description: req.body.description && req.body.description.trim()
  }

  if (!requestedChanges.name) {
    res.status(400).json({
      message: 'A site name is required.'
    })
  } else if (!requestedChanges.description) {
    res.status(400).json({
      message: 'A site description is required.'
    })
  } else {
    SiteSetting.findOne({}).exec(function (err, settings) {
      if (err) {
        res.status(500).json({
          message: err.message
        })
      } else if (settings) {
        settings.name = requestedChanges.name
        settings.description = requestedChanges.description

        settings.save(function (err, saved) {
          if (err) {
            res.status(500).json({
              message: err.message
            })
          } else if (saved) {
            res.status(200).json(saved)
          }
        })
      } else {
        res.status(500).json({
          message: 'Site settings could not be found.'
        })
      }
    })
  }
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
