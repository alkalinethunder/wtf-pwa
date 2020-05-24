const express = require('express')
const auth = require('../middleware/auth')
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')

const router = express.Router()

router.get('/', async function (req, res) {
  try {
    const comments = await Comment.find({}).populate('author')
    res.status(200).json(comments)
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.post('/', auth.authenticate, async function (req, res) {
  try {
    const { type, commentFor, body } = req.body

    switch (type) {
      case 'post':
        const postExists = await Post.findById(commentFor)
        if (!postExists) {
          return res.status(404).json({
            message: 'Specified post does not exist.'
          })
        }
        break;
      case 'reply':
        const existingComment = await Comment.findById(commentFor)
        if (!existingComment) {
          return res.status(404).json({
            message: 'Specified comment not found.'
          })
        }
        break;
      default:
        return res.status(400).json({
          message: 'Invalid comment type.'
        })
    }

    if (body && body.trim()) {
      const newComment = new Comment({
        belongsTo: commentFor,
        body,
        author: req.user,
        commentType: type,
        posted: new Date()
      })

      const saved = await newComment.save()

      res.status(200).json(saved)
    } else {
      res.status(400).json({
        message: 'Comment must have a non-whitespace body.'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.get('/:post', async function (req, res) {
  try {
    const post = await Post.findById(req.params.post)

    if (post) {
      const comments = await Comment.find({
        commentType: 'post',
        belongsTo: post._id
      }).populate('author')

      const response = {
        comments: comments.sort((a, b) => {
          const aDate = new Date(a.posted)
          const bDate = new Date(b.posted)

          return bDate - aDate
        }),
        replies: {}
      }

      for (const comment of response.comments) {
        const replies = await Comment.find({
          belongsTo: comment._id,
          commentType: 'reply'
        }).populate('author')

        response.replies[comment._id] = replies.sort((a, b) => {
          const aDate = new Date(a.posted)
          const bDate = new Date(b.posted)
          return aDate - bDate
        })
      }

      res.status(200).json(response)
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

module.exports = router
