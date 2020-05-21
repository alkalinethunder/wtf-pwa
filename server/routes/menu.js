const express = require('express')
const MenuItem = require('../models/menuitem')

const router = express.Router()

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
      res.status(200).json(items)
    }
  })
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
        if (item.menu_slot === req.params.slot || (req.params.slot === 'primary' && !menuSlots.includes(item.menu_slot))) {
          response.push(item.toJSON())
        }
      }
      res.status(200).json(response)
    }
  })
})

module.exports = router
