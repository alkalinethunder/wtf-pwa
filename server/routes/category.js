const express = require('express')
const slugify = require('slugify')
const Post = require('../models/post')
const Category = require('../models/category')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', async function (req, res) {
  try {
    const categories = await Category.find({})
    res.status(200).json(categories)
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.post('/', auth.owner, async function (req, res) {
  try {
    const { name } = req.body

    if (name && name.trim()) {
      const trimmed = name.trim()
      const slug = slugify(trimmed)

      const existing = await Category.findOne({
        $or: [
          { name: trimmed },
          { slug }
        ]
      })

      if (existing) {
        res.status(400).json({
          message: 'A category with that name already exists.'
        })
      } else {
        const newCategory = new Category({
          name: trimmed,
          slug,
          system: false
        })

        const saved = await newCategory.save()

        res.status(200).json(saved)
      }
    } else {
      res.status(400).json({
        message: 'Category name is required and must not be whitespace.'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.get('/:name', async function (req, res) {
  try {
    const category = await Category.findOne({ slug: req.params.name })
    if (category) {
      const posts = await Post.find({ category }).populate('category').populate('author')
      res.status(200).json({
        category,
        posts
      })
    } else {
      res.status(404).json({
        message: 'Category not found.'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.post('/:name', auth.owner, async function (req, res) {
  try {
    const category = await Category.findOne({ slug: req.params.name })
    if (category) {
      if (category.system) {
        res.status(403).json({
          message: 'You cannot edit a system category.'
        })
      } else {
        const name = req.body.name
        if (name && name.trim()) {
          const trimmed = name.trim()
          const slug = slugify(trimmed)

          if (category.name !== trimmed) {
            const exists = await Category.findOne({
              $or: [
                { name: trimmed },
                { slug }
              ]
            })

            if (exists) {
              return res.status(400).json({
                message: 'A category with that name already exists.'
              })
            } else {
              category.name = trimmed
              category.slug = slug
              const saved = await category.save()
              return res.status(200).json(saved)
            }
          }
        }
        res.status(200).json({
          message: 'No actions were taken.',
          category
        })
      }
    } else {
      res.status(404).json({
        message: 'Category not found.'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.post('/:name/delete', auth.owner, async function (req, res) {
  try {
    const category = await Category.findOne({ slug: req.params.name })
    if (category) {
      // prevent deletion of a system category.
      if (category.system) {
        res.status(403).json({
          message: 'You cannot delete a system category.'
        })
      } else {
        // find the Uncategorized category and then find all posts in the to-be-deleted category.
        const uncategorized = await Category.findOne({ slug: 'uncategorized' })
        const posts = await Post.find({ category })

        // move all posts to uncategorized.
        for (const post of posts) {
          post.category = uncategorized
          await post.save()
        }

        // remove the category.
        await Category.deleteOne(category)

        // Done!
        res.status(200).json({
          message: 'Category deleted successfully.'
        })
      }
    } else {
      res.status(404).json({
        message: 'Category not found.'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

module.exports = router
