const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  const postsRoute = require('./routes/posts')
  const projectsRoute = require('./routes/projects')
  const usersRoute = require('./routes/users')
  const authRoute = require('./routes/auth')

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // allow body-parser support.
  app.use(bodyParser())

  // give API routes so we have a backend.
  app.use('/api/posts', postsRoute);
  app.use('/api/projects', projectsRoute);
  app.use('/api/users', usersRoute);
  app.use('/api/auth', authRoute)

  // Give nuxt middle`ware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

mongoose.connect('mongodb://localhost/wtf')
  .then(() => { start() });
