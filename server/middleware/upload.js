const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const mime = require('mime-types')
const uploadsPath = path.join(__dirname, '..', '..', 'uploads')

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath)
}

if (!fs.existsSync(path.join(uploadsPath, 'avatars'))) {
  fs.mkdirSync(path.join(uploadsPath, 'avatars'))
}

module.exports = multer({
  storage: multer.diskStorage({
    destination (req, file, cb) {
      if (req.path.startsWith('/avatar/')) {
        cb(null, path.join(uploadsPath, 'avatars'))
      } else {
        cb(null, uploadsPath)
      }
    },
    filename (req, file, cb) {
      const fname = crypto.randomBytes(16).toString('hex')
      const extension = mime.extension(file.mimetype) || ''
      if (extension) {
        cb(null, `${fname}.${extension}`)
      } else {
        cb(null, fname)
      }
    }
  })
})
