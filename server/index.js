require('dotenv').config()
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('../nuxt.config.js')
const SiteSetting = require('./models/sitesetting')
const uploadsPath = path.join(__dirname, '..', 'uploads')
const themesPath = path.join(__dirname, '..', 'themes')
const themePath = path.join(themesPath, 'material')
const themeManifestPath = path.join(themePath, 'manifest.json')

// Import and Set Nuxt.js options
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
  const CategoryRouter = require('./routes/category')
  const CommentsRouter = require('./routes/comments')
  const CommentRouter = require('./routes/comment')

  // We kinda need this to parse POST requests.
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // Holy fuck how did we go this long without this
  app.use(morgan('dev'))

  // And that's the frontend.
  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // give API routes so we have a backend.
  app.use('/api/posts', postsRoute)
  app.use('/api/setup', setupRouter)
  app.use('/api/projects', projectsRoute)
  app.use('/api/users', usersRoute)
  app.use('/api/auth', authRoute)
  app.use('/api/pages', PagesRouter)
  app.use('/api/page', PageRouter)
  app.use('/api/theme', ThemeRouter)
  app.use('/api/menu', MenuRouter)
  app.use('/api/category', CategoryRouter)
  app.use('/api/comments', CommentsRouter)
  app.use('/api/comment', CommentRouter)

  // Prevents nuxt from taking over on any requests that intended on interacting with
  // the /api URLs, and that ended up getting a 404.
  app.use(function (req, res, next) {
    if (req.path.startsWith('/api')) {
      res.status(404).json({
        message: 'Requested endpont was not found.'
      })
    } else {
      return next()
    }
  })

  // Static files.
  app.use(express.static(uploadsPath))

  // Give nuxt middle`ware to express
  app.use(nuxt.render)

  // Make the server listen.
  // Jesus fuck, the example file for this was made with poor grammar. Ew.
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

async function assignPostAuthors () {
  const Post = require('./models/post')
  const User = require('./models/user')

  const owner = await User.findOne({ owner: true })

  if (owner) {
    const posts = await Post.find({})
    for (const post of posts) {
      if (!post.author) {
        post.author = owner
        await post.save()
      }
    }
  }
}

async function createDefaultMenuItems () {
  const MenuItem = require('./models/menuitem')
  const Page = require('./models/page')

  const systemPages = await Page.find({ system: true })

  for (const page of systemPages) {
    const exists = await MenuItem.findOne({ name: page.Name, page: page._id, type: 'page' })
    if (!exists) {
      const menuItem = new MenuItem({
        name: page.name,
        slot: 'primary',
        page: page._id,
        type: 'page'
      })
      await menuItem.save()
    }
  }
}

async function ensureSiteSettingsExist () {
  const sitesettings = await SiteSetting.findOne({})
  if (sitesettings) {
    return sitesettings
  } else {
    const newSettings = new SiteSetting({})
    await createDefaultMenuItems()
    return await newSettings.save()
  }
}

async function ensureSystemPage (name, slug, parent, body) {
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

async function ensureSystemCategory (name, slug) {
  const Category = require('./models/category')

  const existingCategory = await Category.findOne({
    name,
    slug
  })

  if (existingCategory) {
    if (!existingCategory.system) {
      existingCategory.system = true
      return await existingCategory.save()
    } else {
      return existingCategory
    }
  } else {
    const category = new Category({
      name,
      slug,
      system: true
    })
    return await category.save()
  }
}

async function categorizeOldPosts (category) {
  const Post = require('./models/post')

  const posts = await Post.find({})

  for (const post of posts) {
    if (!post.category) {
      post.category = category
      await post.save()
    }
  }
}

async function configureDatabase () {
  await mongoose.connect('mongodb://localhost/wtf', { useUnifiedTopology: true, useNewUrlParser: true })

  await ensureSystemPage('Home', '<index>', null, 'Edit this page in **Administration**.')
  await ensureSystemPage('Blog', 'blog', null, 'Edit this page in **Administration**.')

  const uncategorized = await ensureSystemCategory('Uncategorized', 'uncategorized')
  await categorizeOldPosts(uncategorized)
  await assignPostAuthors()

  const sitesettings = await ensureSiteSettingsExist()
  return sitesettings
}

configureDatabase()
  .then((sitesettings) => {
    start(sitesettings)
  })
