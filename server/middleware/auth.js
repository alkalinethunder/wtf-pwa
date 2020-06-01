const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Token = require('../models/token')

class Auth {
  constructor () {
    this.generateToken = this.generateToken.bind(this)
    this.editor = this.editor.bind(this)
    this.admin = this.admin.bind(this)
    this.moderator = this.moderator.bind(this)
    this.refresh = this.refresh.bind(this)
    this.owner = this.owner.bind(this)
  }

  async generateToken (user) {
    const access = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET)
    const refresh = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET)

    const storedToken = new Token({
      token: refresh
    })

    await storedToken.save()

    return {
      access,
      refresh
    }
  }

  async authenticate (req, res, next) {
    try {
      const authHeader = req.headers.authorization
      const token = authHeader && authHeader.split(' ')[1]

      if (token) {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findOne({ _id: payload._id })

        if (user) {
          if (user.banned) {
            return res.status(451).json({
              message: 'User has been banned.'
            })
          } else {
            req.user = user
            return next()
          }
        } else {
          return res.status(401).json({
            message: 'User must be authenticated to access this endpoint.'
          })
        }
      } else {
        return res.status(401).json({
          message: 'User must be authenticated to access this endpoint.'
        })
      }
    } catch (err) {
      return res.status(500).json({
        message: err.message
      })
    }
  }

  editor (req, res, next) {
    this.authenticate(req, res, () => {
      if(req.user && (req.user.owner || req.user.admin || req.user.editor)) {
        next()
      } else {
        res.status(401).json({
          message: 'User must have editor permission to access this endpoint.'
        })
      }
    })
  }

  moderator (req, res, next) {
    this.authenticate(req, res, () => {
      if(req.user && (req.user.owner || req.user.admin || req.user.editor || req.user.moderator)) {
        next()
      } else {
        res.status(401).json({
          message: 'User must be a moderator to access this endpoint.'
        })
      }
    })
  }

  owner (req, res, next) {
    this.authenticate(req, res, () => {
      if (req.user && req.user.owner) {
        next()
      } else {
        res.status(403).json({
          message: 'User must be an owner to access this endpoint.'
        })
      }
    })
  }

  admin (req, res, next) {
    this.authenticate(req, res, () => {
      if (req.user && (req.user.owner || req.user.admin)) {
        next()
      } else {
        res.status(403).json({
          message: 'User lacks the administrator privileges to access this endpoint.  Kindly fuck off, please.'
        })
      }
    })
  }

  refresh (req, res, next) {
    const refreshToken = req.body.refresh_token

    if (refreshToken) {
      Token.findOne({ token: refreshToken }).exec((err, token) => {
        if (err) {
          res.status(500).json({
            message: err.mesage
          })
        } else if (token) {
          jwt.verify(token.token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
              res.status(500).json({
                message: err.message
              })
            } else if (user) {
              User.findOne({ email: user.email }).exec((err, realUser) => {
                if (err) {
                  res.status(500).json({
                    message: err.message
                  })
                } else if (realUser) {
                  this.generateToken(user)
                    .then((t) => {
                      res.status(200).json(t)
                    }).catch((err) => {
                      res.status(500).json({
                        message: err.message
                      })
                    })
                } else {
                  // This is a catch-all, ideally deleting a user account should revoke
                  // their token.
                  res.status(401).json({
                    message: 'User no longer exists.'
                  })
                }
              })
            }
          })
        } else {
          res.status(401).json({
            message: 'Refresh token has been revoked or does not exist.'
          })
        }
      })
    } else {
      res.status(400).json({
        message: 'Please specify a valid refresh token.'
      })
    }
  }
}

module.exports = new Auth()
