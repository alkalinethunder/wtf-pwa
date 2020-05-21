const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const SiteSetting = require('./models/sitesetting')
const fs = require('fs')
const path = require('path')

const themesPath = path.join(__dirname, '..', 'themes')
const themePath = path.join(themesPath, 'material')
const themeManifestPath = path.join(themePath, 'manifest.json')

require('dotenv').config()



// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

// read and parse the theme manifest.
const theme = JSON.parse(fs.readFileSync(themeManifestPath))

app.locals.theme = theme

async function start (siteSettings) {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  const postsRoute = require('./routes/posts')
  const projectsRoute = require('./routes/projects')
  const setupRouter = require('./routes/setup')
  const usersRoute = require('./routes/users')
  const authRoute = require('./routes/auth')
  const PagesRouter = require('./routes/pages')
  const PageRouter = require('./routes/page')
  const ThemeRouter = require('./routes/theme')
  const MenuRouter = require('./routes/menu')

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
  app.use('/api/setup', setupRouter)
  app.use('/api/projects', projectsRoute);
  app.use('/api/users', usersRoute);
  app.use('/api/auth', authRoute)
  app.use('/api/pages', PagesRouter)
  app.use('/api/page', PageRouter)
  app.use('/api/theme', ThemeRouter)
  app.use('/api/menu', MenuRouter)

  // Give nuxt middle`ware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

function ensureSiteSettingsExist () {
  SiteSetting.findOne({}).exec(function (err, settings) {
    if (settings) {
      start(settings)
    } else if (err) {
      throw err
    } else {
      const newSettings = new SiteSetting({})
      newSettings.save(function (err, saved) {
        if (err) {
          throw err
        } else if (saved) {
          start(saved)
        } else {
          throw new Error('Something went SERIOUSLY fucking wrong.')
        }
      })
    }
  })
}

function createHomePage() {
  const Page = require('./models/page')

  Page.findOne({ slug: '<index>' }).exec(function (err, page) {
    if (err) {
      throw err
    } else if (!page) {
      const newHome = new Page({
        name: 'Home',
        slug: '<index>',
        created: new Date(),
        edited: new Date(),
        body: 'Edit this page using **Administration.**'
      })

      newHome.save(function (err, saved) {
        if (err) {
          throw err
        }
      })
    }
  })
}

mongoose.connect('mongodb://localhost/wtf')
  .then(() => { createHomePage() })
  .then(() => { ensureSiteSettingsExist() });
