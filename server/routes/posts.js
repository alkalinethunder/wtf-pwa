const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const Post = require('../models/post');
const auth = require('../middleware/auth')
const Comment = require('../models/comment')

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

router.get('/:slug/comments', function (req, res) {
  const slug = req.params.slug
  Post.findOne({ slug }).exec((err, post) => {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (post) {
      Comment.find({ commentType: 'post', belongsTo: post._id }).populate('author').exec((err, comments) => {
        if (err) {
          res.status(500).json({
            message: err.message
          })
        } else {
          res.status(200).json(comments)
        }
      })
    } else {
      res.status(404).json({
        message: 'Post not found.'
      })
    }
  })
})

router.post('/:slug', auth.admin, function (req, res) {
  const { name, excerpt, body } = req.body

  Post.findOne({ slug: req.params.slug }).exec(async function(err, post) {
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

router.post('/:slug/comments', auth.authenticate, function (req, res) {
  const slug = req.params.slug
  const commentBody = req.body.comment && req.body.comment.trim()

  if (commentBody) {
    Post.findOne({ slug }).exec((err, post) => {
      if (err) {
        res.status(500).json({
          message: err.message
        })
      } else if (post) {
        // TODO: A spam filter is definitely needed. Possibly start with duplicate prevention?
        const comment = new Comment({
          commentType: 'post',
          author: req.user,
          posted: new Date(),
          body: commentBody,
          belongsTo: post._id
        })

        comment.save((err, saved) => {
          if (err) {
            res.status(500).json({
              message: err.message
            })
          } else if (saved) {
            res.status(200).json({
              comment: saved,
              author: req.user
            })
          } else {
            res.status(500).json({
              message: 'Something weird just happened. That comment did not go through.'
            })
          }
        })
      } else {
        res.status(404).json({
          message: 'Post not found.'
        })
      }
    })
  } else {
    res.status(400).json({
      message: 'A non-whitespace comment body is required in the comment field.'
    })
  }
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

router.post('/', auth.editor, function (req, res) {
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
