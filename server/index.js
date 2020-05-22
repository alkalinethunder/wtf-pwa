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

async function ensureSiteSettingsExist () {
  const sitesettings = SiteSetting.findOne({})
  if (sitesettings) {
    return sitesettings
  } else {
    const newSettings = new siteSetting({})
    return await newSettings.save()
  }
}

async function ensureSystemPage(name, slug, parent, body) {
  const Page = require('./models/page')

  const existingPage = await Page.findOne({
    name,
    slug,
    parent
  })

  if (existingPage && !existingPage.system) {
    existingPage.system = true
    return await existingPage.save()
  } else if (!existingPage) {
    if (parent) {
      const parentExists = await Page.findById(parent)
      if (!parentExists) {
        throw new Error('Specified parent page does not exist.')
      }
    }

    const systemPage = new Page({
      name,
      slug,
      body,
      parent,
      created: new Date(),
      edited: new Date(),
      system: true
    })

    return await systemPage.save()
  }

  return existingPage
}

async function configureDatabase() {
  await mongoose.connect('mongodb://localhost/wtf', { useUnifiedTopology: true, useNewUrlParser: true })

  const homepage = await ensureSystemPage('Home', '<index>', null, 'Edit this page in **Administration**.')
  const blog = await ensureSystemPage('Blog', 'blog', null, 'Edit this page in **Administration**.')

  const sitesettings = await ensureSiteSettingsExist()
  return sitesettings
}

configureDatabase()
  .then((sitesettings) => {
    start(sitesettings)
  })
