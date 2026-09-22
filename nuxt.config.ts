// https://nuxt.com/docs/api/configuration/nuxt-config
const productionOrigin = 'https://binzomah.net'

// Read directly rather than via nuxt's resolved app.baseURL — nuxt.config.ts
// runs before that's settled, and this is the same source Nuxt itself
// reads to populate it. Used below for the favicon href, which — unlike a
// static template src="..." — is NOT automatically base-path-prefixed by
// Nuxt's build tooling (declarative head config is a different code path
// from the Vite/Vue asset-URL transform); see shared/utils/asset-url.ts
// for the same issue on the component side.
const appBaseURL = process.env.NUXT_APP_BASE_URL || '/'
const withBase = (path: string) => `${appBaseURL.replace(/\/$/, '')}${path}`

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
    baseURL: appBaseURL,
    head: {
      titleTemplate: '%s · Binzomah Cosmetics',
      // Explicit rather than relying on the browser's implicit /favicon.ico
      // lookup: that request always goes to the origin root and ignores
      // app.baseURL, so it 404s under any non-root base path (e.g. a
      // GitHub Pages project site at /reponame/).
      link: [{ rel: 'icon', type: 'image/x-icon', href: withBase('/favicon.ico') }],
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

        // Prerender seeds must carry the app's base path (NUXT_APP_BASE_URL,
        // e.g. "/binzomh/" for a GitHub Pages project site). Without this,
        // every seed 404s against the base-path-aware app, and Nitro's own
        // 404 handler (nitropack/dist/core/index.mjs) silently turns each
        // one into a 302-redirect stub ("Redirecting...") pointing at the
        // correctly-prefixed URL — nothing actually gets rendered, and since
        // the crawler has no real HTML to extract further links from, the
        // whole site collapses to those few stub files. Confirmed by
        // reproducing with and without a base path: unprefixed seeds only
        // fail once a non-root base path is set.
        const base = (config.baseURL || '/').replace(/\/$/, '')
        config.prerender.routes = ['/', '/en', '/ar', '/sitemap.xml', '/robots.txt']
          .map(route => `${base}${route}`)
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
