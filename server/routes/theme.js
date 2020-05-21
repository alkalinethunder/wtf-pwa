const express = require('express')
const router = express.Router()

// Themes are not yet implemented.  However, for the menu system, we
// need a way to tell the frontend and admin panel about the current wtf-pwa
// "theme" and thus the menu slots that are available to the Menu System.
//
// In the future, it will be up to each individual theme to write a Theme Manifest
// and up to us as an API to know what the active theme is and provide the manifest
// to the frontend.  It is also up to us to serve the right Nuxt layouts/components
// and configs based on what theme is active.
//
// For now, this is a hardcoded json theme manifest. It's fake.
const hardcodedThemeManifest = {
  name: 'Material Design',
  author: 'Alkaline Thunder',
  system: true,
  description: 'Mobile-friendly Material Design theme for wtf-pwa written using Vuetify.  Supports dark theme toggle and responsive layout for desktop and mobile.  This is the default system layout.',
  supportsDarkMode: true,
  menus: [
    {
      slot: 'primary',
      name: 'Primary Navigation',
      description: 'The navigation menu shown in the page header area (desktop) and App Drawer (mobile).'
    },
    {
      slot: 'footer-1',
      name: 'Footer 1',
      description: 'A vertical navigation menu displayed on the left side of the footer.'
    },
    {
      slot: 'footer-2',
      name: 'Footer 2',
      description: 'A vertical navigation menu displayed in the middle of the footer.'
    },
    {
      slot: 'footer-3',
      name: 'Footer 3',
      description: 'A vertical navigation menu displayed on the right side of the footer.'
    }
  ],
  prismTheme: 'prism-twilight'
}

router.get('/', function (req, res) {
  res.status(200).json(hardcodedThemeManifest)
})

module.exports = router
