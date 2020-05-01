const express = require('express')
const router = express.Router()

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

module.exports = router
