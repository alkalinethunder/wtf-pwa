const express = require('express')
const auth = require('../middleware/auth')
const MenuItem = require('../models/menuitem')
const Post = require('../models/post')
const Page = require('../models/page')

const router = express.Router()

function validateMenuLink(type, id, callback) {
  switch (type) {
    case 'page':
      Page.findById(id).exec(function (err, page) {
        if (err) {
          callback(err, false)
        } else if (page) {
          callback(null, true)
        } else {
          callback(null, false)
        }
      })
      break
    case 'post':
      Post.findById(id).exec(function (err, post) {
        if (err) {
          callback(err, false)
        } else if (post) {
          callback(null, true)
        } else {
          callback(null, false)
        }
      })
      break;
    case 'external':
      if (id.trim()) {
        callback(null, true)
      } else {
        callback(null, false)
      }
      break;
    default:
      callback(new Error('invalid menu link type.'), false)
      break;
  }
}

async function traversePageTree(id) {
  const pages = []
  let descendant = await Page.findById(id)
  pages.unshift(descendant)
  while(descendant.parent) {
    descendant = await Page.findById(descendant.parent)
    pages.unshift(descendant)
  }
  return pages
}

async function getPageSlug(id) {
  const parents = await traversePageTree(id)
  let slug = ''
  for (const page of parents) {
    slug += '/'
    if (page.slug === '<index>') {
      continue
    }
    slug += page.slug
  }
  return slug
}

async function setMenuItemLink(item) {
  switch (item.type) {
    case 'post':
      const post = await Post.findById(item.post)
      item.href = `/blog/${post.slug}`
      break;
    case 'page':
      item.href = await getPageSlug(item.page)
      break;
  }
  return item
}

async function setMenuItemLinks(items) {
  const modified = []
  for (const item of items) {
    modified.push(await setMenuItemLink(item))
  }
  return modified
}

function getAvailableSlotNames(manifest) {
  const slots = []
  for (let slot of manifest.menus) {
    if (!slots.includes(slot.slot)) {
      slots.push(slot.slot)
    }
  }
  return slots
}

router.get('/', function (req, res) {
  MenuItem.find({}).exec(function (err, items) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else {
      setMenuItemLinks(items)
        .then((items) => {
          res.status(200).json(items)
        }).catch((err) => {
          res.status(500).json({
            message: err.message
          })
        })
    }
  })
})

router.post('/', auth.owner, function (req, res) {
  const { name, type, slot, href, page, post } = req.body
  const slots = getAvailableSlotNames(req.app.locals.theme)

  if (!slots.includes(slot)) {
    res.status(400).json({
      message: 'Specified slot not specified by current theme.'
    })
  } else {
    if (!name || !name.trim()) {
      res.status(400).json({
        message: 'Menu item name is required.'
      })
    } else {
      let id = href
      if (type === 'post') id = post
      if (type === 'page') id = page

      validateMenuLink(type, id, function (err, found) {
        if (err) {
          res.status(500).json({
            message: err.message
          })
        } else if (found) {
          MenuItem.findOne({
            name,
            slot
          }).exec(function (err, exists) {
            if (err) {
              res.status(500).json({
                message: err.message
              })
            } else if (exists) {
              res.status(400).json({
                message: 'A menu item with this name already exists in the slot.'
              })
            } else {
              const newItem = new MenuItem({
                name,
                slot,
                href,
                page,
                post,
                type
              })

              newItem.save(function (err, saved) {
                if (err) {
                  res.status(500).json({
                    message: err.message
                  })
                } else if (saved) {
                  setMenuItemLink(saved)
                    .then((item) => {
                      res.status(200).json(saved)
                    }).catch((err) => {
                      res.status(500).json({
                        message: err.message
                      })
                    })
                } else {
                  res.status(500).json({
                    message: 'An error has occurred saving the menu item.'
                  })
                }
              })
            }
          })
        } else {
          res.status(404).json({
            message: 'Either a valid Post or Page was not found, or the given external link for the menu item was blank.'
          })
        }
      })
    }
  }
})

router.get('/:slot', function (req, res) {
  const menuSlots = getAvailableSlotNames(req.app.locals.theme)
  MenuItem.find({}).exec(function (err, menuItems) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else {
      const response = []
      for (let item of menuItems) {
        if (item.slot === req.params.slot || (req.params.slot === 'primary' && !menuSlots.includes(item.slot))) {
          response.push(item.toJSON())
        }
      }
      setMenuItemLinks(response)
        .then((items) => {
          res.status(200).json(items)
        }).catch((err) => {
          res.status(500).json({
            message: err.message
          })
        })
    }
  })
})

module.exports = router
