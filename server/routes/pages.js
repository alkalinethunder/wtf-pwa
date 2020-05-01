const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const auth = require('../middleware/auth')

const reservedNames = [
  'index',
  'home',
  '<index>',
  'delete',
  'edit'
]

const Page = require('../models/page')

router.get('/', function (req, res) {
  Page.find({}).exec(function (err, pages) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else {
      res.status(200).json(pages)
    }
  })
})

router.get('/index', function (req, res) {
  Page.findOne({ slug: '<index>' }).exec(function (err, page) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (page) {
      res.status(200).json(page)
    } else {
      res.status(404).json({
        message: 'Page not found.'
      })
    }
  })
})

router.get('/:page', function (req, res) {
  Page.findOne({ slug: req.params.page, parent: null }).exec(function (err, page) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (page) {
      res.status(200).json(page)
    } else {
      res.status(404).json({
        message: 'Page not found.'
      })
    }
  })
})

router.get('/:page/:subpage', function (req, res) {
  Page.findOne({ slug: req.params.page, parent: null }).exec(function (err, page) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (page) {
      Page.findOne({ slug: req.params.subpage, parent: page._id }).exec(function (err, subpage) {
        if (err) {
          res.status(500).json({
            message: err.message
          })
        } else if (subpage) {
          res.status(200).json(subpage)
        } else {
          res.status(404).json({
            message: 'Page not found.'
          })
        }
      })
    } else {
      res.status(404).json({
        message: 'Page not found.'
      })
    }
  })
})

router.post('/', auth.owner, function (req, res) {
  const { name, body } = req.body

  const trimmedName = name && name.trim()

  if (trimmedName) {
    if (reservedNames.includes(trimmedName.toLowerCase())) {
      res.status(400).json({
        message: 'The specified page name is reserved for special use within the API.'
      })
    } else {
      const trimmedBody = body && body.trim()

      if (trimmedBody) {
        const slug = slugify(trimmedName)

        Page.findOne({
          $or: [
            { slug },
            { name: trimmedName }
          ],
          parent: null
        }).exec(function (err, exists) {
          if (err) {
            res.status(500).json({
              message: err.message
            })
          } else if (exists) {
            res.status(400).json({
              message: 'A page with that name already exists.'
            })
          } else {
            const page = new Page({
              name: trimmedName,
              body: trimmedBody,
              slug,
              parent: null,
              created: new DAte(),
              edited: new Date()
            })

            page.save(function (err, saved) {
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
      } else {
        res.status(400).json({
          message: 'Page body cannot be blank.'
        })
      }
    }
  } else {
    res.status(400).json({
      message: 'Page name must not be blank.'
    })
  }
})

router.post('/:page', auth.owner, function (req, res) {
  Page.findOne({ slug: req.params.page, parent: null }).exec(function (err, page) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (page) {
      const { name, body } = req.body

      const trimmedName = name && name.trim()
      const trimmedBody = body && body.trim()
      const newSlug = slugify(trimmedName)

      if (trimmedName) {
        if (reservedNames.includes(trimmedName.toLowerCase())) {
          res.status(400).json({
            message: 'The name you chose has been reserved for a specific action in the API.'
          })
        } else {
          Page.findOne({
            $or: [
              { slug: newSlug },
              { name: trimmedName }
            ],
            parent: page._id
          }).exec(function (err, exists) {
            if (err) {
              res.status(500).json({
                message: err.message
              })
            } else if (exists) {
              res.status(400).json({
                message: 'A page with that name already exists.'
              })
            } else {
              const newPage = new Page({
                slug: newSlug,
                name: trimmedName,
                body: trimmedBody,
                created: new Date(),
                edited: new Date()
              })

              newPage.save(function (err, saved) {
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
      } else {
        res.status(400).json({
          message: 'A name is required for the new page.'
        })
      }
    } else {
      res.status(404).json({
        message: 'Page not found.'
      })
    }
  })
})

module.exports = router
