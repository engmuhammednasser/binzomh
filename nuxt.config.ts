// https://nuxt.com/docs/api/configuration/nuxt-config
const productionOrigin = 'https://binzomah.net'

export default defineNuxtConfig({

  modules: ['@nuxtjs/i18n', '@nuxt/eslint'],

  $development: {
    runtimeConfig: {
      public: {
        siteUrl: 'http://localhost:3000',
      },
    },
  },
  devtools: { enabled: true },

  app: {
    head: {
      titleTemplate: '%s · Binzomah Cosmetics',
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      siteUrl: productionOrigin,
    },
  },
  compatibilityDate: '2025-07-15',

  nitro: {
    prerender: {
      crawlLinks: false,
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  hooks: {
    'nitro:config'(config) {
      // Only static generation freezes pages/SEO to the build-time origin.
      // Server builds must read NUXT_PUBLIC_SITE_URL on each deployment.
      if (config.static) {
        config.prerender ||= {}
        config.prerender.crawlLinks = true
        config.prerender.routes = ['/', '/en', '/ar', '/sitemap.xml', '/robots.txt']
      }
    },
  },

  eslint: {
    config: {
      stylistic: {
        semi: false,
        quotes: 'single',
      },
    },
  },

  i18n: {
    // i18n resolves the localized SEO paths; usePageSeo applies the runtime
    // siteUrl origin to its link/og:url tags without mutating shared config.
    baseUrl: productionOrigin,
    locales: [
      { code: 'en', language: 'en-US', dir: 'ltr', name: 'English', file: 'en.json' },
      { code: 'ar', language: 'ar-SA', dir: 'rtl', name: 'العربية', file: 'ar.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'binzomh_locale',
      cookieCrossOrigin: false,
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en',
    },
  },
})
