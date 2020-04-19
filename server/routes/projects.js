const express = require('express')
const router = express.Router()

const posts = [
  {
    id: 0,
    name: 'A cool post',
    date: new Date(),
    body: 'This is the post body.',
    featuredUrl: 'https://http.cat/404'
  }
]

router.get('/', function (req, res) {
  res.status(200).json(posts);
})

module.exports = router
