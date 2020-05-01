const colors = require('vuetify/es5/util/colors').default

module.exports = {
  mode: 'spa',
  router: {
    middleware: [
      'setup'
    ]
  },
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: "stylesheet", href: "https://use.fontawesome.com/releases/v5.0.13/css/all.css" },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  auth: {
    strategies: {
      local: {
        _scheme: 'refresh',
        token: {
          property: 'access'
        },
        refreshToken: {
          property: 'refresh'
        },
        user: {
          property: false,
          autoFetch: true
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          user: { url: '/api/auth/user', method: 'get', propertyName: false },
          refresh: { url: '/api/auth/refresh', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'post' }
        },
        autoFetchUser: true
      }
    }
  },
  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    injected: true,
    html: true,
    use: [
      'markdown-it-div',
      'markdown-it-attrs',
      'markdown-it-sanitizer'
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/localStorage.js', ssr: false },
    { src: '~/plugins/markdown.js', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/markdownit'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.BASE_URL || 'https://new.alkalinethunder.wtf/'
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    treeShake: false,
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.blue.darken2,
          accent: colors.grey.lighten1,
          secondary: colors.amber.darken1,
          info: colors.teal.darken1,
          warning: colors.amber.darken1,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
