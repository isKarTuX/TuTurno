export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxt/fonts',
    '@vee-validate/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
  ],

  fonts: {
    families: [
      { name: 'Unbounded', provider: 'google', weights: [400, 500, 600, 700, 800, 900] },
      { name: 'Dela Gothic One', provider: 'google', weights: [400] },
    ],
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  css: [
    '~/assets/css/main.css',
    '~/assets/css/glass.css',
    '~/assets/css/animations.css',
  ],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts',
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
    vapidEmail: process.env.VAPID_EMAIL,

    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
      wsUrl: process.env.NUXT_PUBLIC_WS_URL || 'ws://localhost:3000',
      dbDriver: process.env.DB_DRIVER || 'sqlite',
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/entidades': { prerender: true },
    '/problema': { prerender: true },
    '/nosotros': { prerender: true },
    '/auth/**': { ssr: false },
    '/app/**': { ssr: false },
    '/operator/**': { ssr: false },
    '/admin/**': { ssr: false },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'TuTurno',
      short_name: 'TuTurno',
      theme_color: '#6C3AE8',
      background_color: '#09090B',
      display: 'standalone',
    },
  },

  nitro: {
    experimental: {
      websocket: true,
    },
  },
})