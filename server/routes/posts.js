const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const Post = require('../models/post')
const auth = require('../middleware/auth')
const Category = require('../models/category')

router.get('/:slug', function (req, res) {
  Post.findOne({ slug: req.params.slug })
    .populate('category')
    .populate('author')
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

router.post('/:slug', auth.admin, function (req, res) {
  const { name, excerpt, body } = req.body

  Post.findOne({ slug: req.params.slug }).exec(async function (err, post) {
    try {
      if (err) {
        res.status(500).json({
          message: err.message
        })
      } else if (post) {
        if (name) {
          const newName = name.trim()
          if (newName !== post.name) {
            const newSlug = slugify(newName)
            const existingPost = await Post.findOne({
              $or: [
                { name: newName },
                { slug: newSlug }
              ]
            })

            if (existingPost) {
              res.status(400).json({
                message: 'A post with that name already exists.'
              })
            } else {
              post.name = newName
              post.slug = newSlug
            }
          }
        }

        if (excerpt) {
          post.excerpt = excerpt.trim()
        }

        if (body) {
          post.body = body.trim()
        }

        const saved = await post.save()

        res.status(200).json(saved)
      } else {
        res.status(404).json({
          message: 'Post not found.'
        })
      }
    } catch (err) {
      res.status(500).json({
        message: err.message
      })
    }
  })
})

router.post('/:slug/delete', auth.admin, function (req, res) {
  const slug = req.params.slug
  Post.deleteOne({
    slug
  }).exec(function (err, result) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (result.ok) {
      res.status(200).json(result)
    } else {
      res.status(404).json({
        message: 'Post not found.'
      })
    }
  })
})

router.get('/', function (req, res) {
  Post.find({}).populate('category').populate('author').exec(function (err, posts) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else {
      res.status(200).json(posts)
    }
  })
})

router.post('/', auth.editor, async function (req, res) {
  try {
    const name = req.body.name ? req.body.name.trim() : null
    const excerpt = req.body.excerpt ? req.body.excerpt.trim() : ''
    const body = req.body.body ? req.body.body.trim() : ''
    const categoryId = req.body.category
    const slug = slugify(name)

    if (!name) {
      res.status(400).json({
        message: 'A non-empty name is required.'
      })
    } else if (!categoryId) {
      res.status(400).json({
        message: 'A category ID is required.'
      })
    } else {
      const category = await Category.findById(categoryId)
      if (category) {
        const existingPost = await Post.findOne({
          $or: [
            { category, name },
            { category, slug }
          ]
        })

        if (existingPost) {
          res.status(400).json({
            message: 'A post with that name already exists in the category.'
          })
        } else {
          const post = new Post({
            views: 0,
            created: new Date(),
            author: req.user,
            category,
            name,
            slug,
            excerpt,
            body
          })

          const saved = await post.save()

          res.status(200).json(saved.toJSON())
        }
      } else {
        res.status(404).json({
          message: 'Specified category was not found.'
        })
      }
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

module.exports = router
