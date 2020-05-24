const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const auth = require('../middleware/auth')

const Page = require('../models/page')

const reservedNames = [
  'index',
  '<index>',
  'delete',
  'id',
  'edit'
]

function moveChildren (page, moveTo, callback) {
  function findNewHome(moveTo, callback) {
    if (moveTo) {
      if (moveTo === page._id) {
        callback(new Error('Attempted to move children to where they already are.'), null)
      } else {
        Page.findById(moveTo).exec(function (err, page) {
          if (err) {
            callback(err, false)
          } else if (page) {
            callback(null, page._id)
          } else {
            callback(null, false)
          }
        })
      }
    } else {
      callback(null, null)
    }
  }

  findNewHome(moveTo, function (err, home) {
    if (err) {
      callback(err, null)
    } else if (home === false) {
      callback(new Error('New parent for children was not found.'), null)
    } else {
      Page.updateMany({
        parent: page._id
      }, {
        parent: home
      }).exec(function (err, updated) {
        callback(err, updated)
      })
    }
  })
}

function deleteRecursively (page, callback) {
  async function collectChildren (page) {
    const collected = []
    const children = await Page.find({
      parent: page._id
    })

    for (const child of children) {
      const childCollected = await collectChildren(child)
      for (const c of childCollected) {
        collected.push(c)
      }
      collected.push(child._id)
    }

    return collected
  }

  collectChildren(page)
    .then(async (ids) => {
      for (const id of ids) {
        await Page.deleteOne({ _id: id })
      }
      await Page.deleteOne(page)
      callback(null, true)
    }).catch((err) => {
      callback(err, null)
    })
}

function performParentCheck (id, callback) {
  if (id) {
    Page.findById(id).exec((err, page) => {
      if (err) {
        callback(err, null)
      } else if (page) {
        callback(null, page)
      } else {
        callback(new Error('The given parent page ID does not exist.'), null)
      }
    })
  } else {
    callback(null, null)
  }
}

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

router.post('/', auth.owner, function (req, res) {
  const { name, body, parent } = req.body

  const trimmedName = name && name.trim()
  const trimmedBody = body && body.trim()
  const slug = slugify(trimmedName).toLowerCase()
  const parentId = parent || null

  if (!trimmedName) {
    res.status(400).json({
      message: 'Page name is required.'
    })
  } else if (reservedNames.includes(trimmedName) || reservedNames.includes(slug)) {
    res.status(400).json({
      message: 'The API has reserved the given page name or resulting slug for use as a command, and thus it cannot be used in this case.'
    })
  } else {
    performParentCheck(parentId, (err, parentPage) => {
      if (err) {
        res.status(500).json({
          message: err.message
        })
      } else {
        Page.findOne({
          parent: parentId,
          $or: [
            { slug },
            { name: trimmedName }
          ]
        }).exec(function (err, exists) {
          if (err) {
            res.status(500).json({
              message: err.message
            })
          } else if (exists) {
            res.status(400).json({
              message: 'A page with the given name or resulting slug already exists.'
            })
          } else {
            const newPage = new Page({
              name: trimmedName,
              slug,
              body: trimmedBody,
              created: new Date(),
              edited: new Date(),
              parent: parentPage
            })

            newPage.save(function (err, saved) {
              if (err) {
                res.status(500).json({
                  message: err.message
                })
              } else if (saved) {
                const responsePayload = {
                  page: saved,
                  url: (parentPage) ? `/${parentPage.slug}/${saved.slug}` : `/${saved.slug}`
                }
                res.status(200).json(responsePayload)
              }
            })
          }
        })
      }
    })
  }
})

router.post('/delete/:id', auth.owner, function (req, res) {
  const { recursive, moveChildrenTo } = req.body

  Page.findById(req.params.id).exec(function (err, page) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (page) {
      if (page.slug === '<index>') {
        res.status(400).json({
          message: "You cannot delete the site's home page."
        })
      } else if (recursive) {
        deleteRecursively(page, function (err, done) {
          if (err) {
            res.status(500).json({
              message: ''
            })
          } else {
            res.status(200).json({
              message: 'All pages deleted successfully.'
            })
          }
        })
      } else {
        moveChildren(page, moveChildrenTo, function (err, done) {
          if (err) {
            res.status(500).json({
              message: err.message
            })
          } else {
            Page.deleteOne(page).exec(function (err, deleted) {
              if (err) {
                res.status(500).json({
                  message: err.message
                })
              } else {
                res.status(200).json({
                  message: 'Page deleted successfully.'
                })
              }
            })
          }
        })
      }
    } else {
      res.status(404).json({
        message: 'Page not found.'
      })
    }
  })

})

router.get('/:id', function (req, res) {
  Page.findById(req.params.id).exec(function (err, page) {
    if (err) {
      res.status(500).json({
        message: err.message
      })
    } else if (page) {
      res.status(200).json(page)
    } else {
      res.status(404).json({
        message: 'Pasge not found.'
      })
    }
  })
})

router.post('/:id', auth.owner, async function (req, res) {
  try {
    const { name, parent, body } = req.body
    const page = await Page.findById(req.params.id)

    if (!page) {
      return res.status(404).json({
        message: 'Page not found.'
      })
    }

    if (parent !== page.parent) {
      if (parent !== undefined) {
        if (page.system) {
          return res.status(403).json({
            message: 'System pages cannot be moved.'
          })
        } else if (parent === null) {
          page.parent = parent
        } else {
          const parentPage = await Page.findById(parent)
          if (parentPage) {
            let ancestorCheck = parentPage
            while (ancestorCheck) {
              if (ancestorCheck._id === page._id) {
                return res.status(400).json({
                  message: 'Cannot set parent of requested page to a child of that page.'
                })
              }
              ancestorCheck = ancestorCheck.parent ? await Page.findById(ancestorCheck.parent) : null
            }
            page.parent = parentPage
          } else {
            return res.status(404).json({
              message: 'New parent page was not found.'
            })
          }
        }
      }
    }

    if (name) {
      const trimmed = name.trim()
      const slug = slugify(trimmed).toLowerCase()

      if (slug !== page.slug) {
        if (page.system) {
          return res.status(403).json({
            message: 'System pages cannot be renamed.'
          })
        } else {
          const existingPage = await Page.findOne({
            parent: page.parent,
            $or: [
              { slug },
              { name: trimmed }
            ]
          })

          if (existingPage) {
            return res.status(400).json({
              message: 'A page already exists with that name.'
            })
          } else {
            page.name = trimmed
            page.slug = slug
          }
        }
      }
    }

    if (body && body.trim()) {
      page.body = body
      page.edited = new Date()

      const saved = await page.save()

      res.status(200).json(saved)
    } else {
      res.status(400).json({
        message: 'Page body is required.'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

module.exports = router
