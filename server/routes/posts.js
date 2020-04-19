const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const Post = require('../models/post');

router.get('/:slug', function (req, res) {
  Post.findOne({ slug: req.params.slug })
    .exec(function (err, post) {
      if (err) {
        res.status(500).json({
          message: err.message
        })
      } else if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({
          message: 'Post not found.'
        })
      }
    })
})

router.get('/', function (req, res) {
  Post.find({}).exec(function (err, posts) {
    if(err) {
      res.status(500).json({
        message: err.message
      })
    } else {
      res.status(200).json(posts)
    }
  })
})

router.post('/', function (req, res) {
  const newPost = new Post({
    name: req.body.name,
    slug: slugify(req.body.name),
    excerpt: req.body.excerpt,
    body: req.body.body,
    views: 0,
    created: new Date(),
    featuredUrl: req.body.featuredUrl,
    tags: req.body.tags,
    category: req.body.category
  })

  newPost.save(function (err, post) {
    if (err) {
      res.status(400).json({
        message: err.message
      })
    } else {
      res.status(200).json(post);
    }
  })
})

module.exports = router
