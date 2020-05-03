const express = require('express')
const router = express.Router()
const Page = require('../models/page')

router.get('/', function (req, res) {
  Page.findOne({ slug: '<index>' }).exec(function (err, page) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (page) {
      res.status(200).json({
        page,
        breadcrumbs: []
      })
    } else {
      res.status(404).json({
        message: 'Page not found.'
      })
    }
  })
})

router.get(/\/.+/, function (req, res) {
  const path = req.path
  const segments = path.split('/')
  segments.shift()

  const breadcrumbs = []

  function getPage(parent, slugs, slugIndex, callback) {
    const slug = slugs[slugIndex]
    Page.findOne({
      parent,
      slug
    }).exec(function (err, page) {
      if (err) {
        callback(err, null)
      } else if (page) {
        breadcrumbs.push({
          name: page.name,
          url: `/${slugs.slice(0, slugIndex + 1).join('/')}`
        })

        if (slugIndex + 1 >= slugs.length) {
          callback(null, page)
        } else {
          getPage(page._id, slugs, slugIndex + 1, callback)
        }
      } else {
        callback(err, false)
      }
    })
  }

  getPage(null, segments, 0, function (err, page) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (page) {
      res.status(200).json({
        page,
        breadcrumbs
      })
    } else {
      res.status(404).json({
        message: 'Page not found.'
      })
    }
  })
})

module.exports = router
