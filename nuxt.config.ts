// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@nuxtjs/i18n', '@nuxt/eslint'],
  devtools: { enabled: true },

  app: {
    head: {
      titleTemplate: '%s · Binzomah Cosmetics',
    },
  },

  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en', '/ar'],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
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
    // Placeholder production domain, assumed from the project's own
    // contact-email domain (binzomah.net) — not yet confirmed by the
    // company. Required for absolute canonical/hreflang URLs; update this
    // (or set NUXT_PUBLIC_SITE_URL) once the real domain is confirmed. See
    // docs/deployment-assumptions.md.
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.binzomah.net',
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
