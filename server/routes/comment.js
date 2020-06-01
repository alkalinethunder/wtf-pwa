const express = require('express')
const auth = require('../middleware/auth')
const Comment = require('../models/comment')

const router = express.Router()

function canEdit (comment, user) {
  if (comment.author.id === user.id) {
    return true
  } else {
    return user.owner || user.admin || user.editor || user.moderator
  }
}

router.get('/:id', async function (req, res) {
  try {
    const comment = await Comment.findOne({ _id: req.params.id }).populate('author')

    if (comment) {
      res.status(200).json(comment)
    } else {
      res.status(404).json({
        message: 'Comment not found.'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.post('/:id/delete', auth.authenticate, async function (req, res) {
  try {
    const comment = await Comment.findOne({ _id: req.params.id }).populate('author')

    if (comment) {
      if (canEdit(comment, req.user)) {
        // delete any child comments
        if (comment.commentType === 'post') {
          await Comment.deleteMany({
            commentType: 'reply',
            belongsTo: comment._id
          })
        }

        // Delete the comment itself.
        await Comment.deleteOne(comment)

        res.status(200).json(comment)
      } else {
        res.status(403).json({
          message: 'Only comment authors and moderators can delete a comment.'
        })
      }
    } else {
      res.status(404).json({
        message: 'Comment not found.'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.post('/:id', auth.authenticate, async function (req, res) {
  try {
    const comment = await Comment.findOne({ _id: req.params.id }).populate('author')

    if (comment) {
      const { body } = req.body

      if (canEdit(comment, req.user)) {
        if (body && body.trim()) {
          const newBody = body.trim()

          if (newBody === comment.body) {
            res.status(200).json(comment)
          } else {
            comment.body = newBody
            const saved = await comment.save()
            res.status(200).json(saved)
          }
        } else {
          res.status(400).json({
            message: 'Comment cannot be empty.'
          })
        }
      } else {
        res.status(403).json({
          message: 'Only comment authors and moderators are able to edit a comment.'
        })
      }
    } else {
      res.status(404).json({
        message: 'Comment not found.'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

module.exports = router
