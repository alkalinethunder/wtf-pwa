const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Token = require('../models/token')

function generateToken (user, cb) {
  const access = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
  const refresh = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET)

  const storedToken = new Token({
    token: refresh
  })

  storedToken.save(function (err, token) {
    cb(err, {
      access,
      refresh
    })
  })
}

module.exports = {
  generateToken,
  authenticate (req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
        if (err) {
          res.status(401).json({
            message: err.message
          })
        } else if (user) {
          if (user.banned) {
            res.status(451).json({
              message: 'User has been banned.'
            })
          } else {
            req.user = user
            next()
          }
        } else {
          res.status(401).json({
            message: 'User must be authenticated to access this endpoint.'
          })
        }
      })
    } else {
      res.status(401).json({
        message: 'User must be authenticated to access this endpoint.'
      })
    }
  },
  editor (req, res, next) {
    this.authenticate(req, res, function () {
      if(req.user && (req.user.admin || req.user.editor)) {
        next()
      } else {
        res.status(401).json({
          message: 'User must have editor permission to access this endpoint.'
        })
      }
    })
  },
  moderator (req, res, next) {
    this.authenticate(req, res, function () {
      if(req.user && (req.user.admin || req.user.editor || req.user.moderator)) {
        next()
      } else {
        res.status(401).json({
          message: 'User must be a moderator to access this endpoint.'
        })
      }
    })
  },
  admin (req, res, next) {
    this.authenticate(req, res, function () {
      if (req.user && req.user.admin) {
        next()
      } else {
        res.status(403).json({
          message: 'User lacks the administrator privileges to access this endpoint.  Kindly fuck off, please.'
        })
      }
    })
  },
  refresh (req, res, next) {
    const refreshToken = req.body.token

    if (refreshToken) {
      Token.findOne({ token: refreshToken }).exec(function (err, token) {
        if (err) {
          res.status(500).json({
            message: err.mesage
          })
        } else if (token) {
          jwt.verify(token.token, process.env.REFRESH_TOKEN_SECRET, function (err, user) {
            if (err) {
              res.status(500).json({
                message: err.message
              })
            } else if (user) {
              User.findOne({ email: user.email }).exec(function (err, realUser) {
                if (err) {
                  res.status(500).json({
                    message: err.message
                  })
                } else if (realUser) {
                  generateToken(realUser, function (err, token) {
                    if (err) {
                      res.status(500).json({
                        message: err.message
                      })
                    } else {
                      res.status(200).json(token)
                    }
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
