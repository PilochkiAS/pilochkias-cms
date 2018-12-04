module.exports = {
  server: {
    port: 80
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'pilochki-cms',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js + Vuetify.js project' },
      { hid: 'theme-color', name: 'theme-color', content: '#C2185B' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  plugins: ['~/plugins/vuetify.js'],
  css: ['~/assets/style/app.styl'],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#26C6DA' },
  /*
  ** Build configuration
  */
  manifest: {
    name: 'PilochkiAS',
    lang: 'ru',
    theme_color: '#26C6DA',
    short_name: 'PilochkiAS'
  },
  workbox: {
    debug: true
  },
  icon: {},
  meta: {
    mobileAppIOS: true
  },
  modules: [
    '@nuxtjs/onesignal',
    '@nuxtjs/pwa',
    '@nuxtjs/axios'
  ],
  axios: {
    baseURL: '/',
    proxyHeaders: false,
    credentials: false
  },
  oneSignal: {
    /** If you want to test a push notifications locally you need to uncomment this line:
     * appId: 'ed57b76b-d236-422e-b514-eff9397f5e56',
     * */
    init: {
      appId: 'fe75f5d6-43e3-4a90-b7e6-46faa5136a76'
      // appId: 'ed57b76b-d236-422e-b514-eff9397f5e56',
    }
  },
  build: {
    watch: ['server'],
    extractCSS: true,
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  serverMiddleware: [
    '~/server/index.js'
  ]
}
