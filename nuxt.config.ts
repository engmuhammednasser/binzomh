// https://nuxt.com/docs/api/configuration/nuxt-config
import { staticLocaleEntry } from './build/static-entry'
import { withStaticCsp } from './server/utils/security-policy'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

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

  // The dashboard is opt-in for Node deployments; normal public builds
  // exclude its routes/layout. See layers/admin/README.md.
  extends: ['./layers/admin'],

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
    admin: {
      enabled: process.env.NUXT_ADMIN_ENABLED === 'true',
      dbPath: '.data/admin.sqlite',
      origin: '',
      secureCookies: process.env.NODE_ENV === 'production',
    },
    public: {
      adminEnabled: process.env.NUXT_ADMIN_ENABLED === 'true',
      siteUrl: productionOrigin,
      // Where the contact form posts, set per environment via
      // NUXT_PUBLIC_CONTACT_FORM_ENDPOINT. Public by nature — it is the
      // URL a browser posts to, not a credential, so nothing secret is
      // exposed by it being here.
      //
      // Empty by default on purpose: with no endpoint the form still
      // renders but is display-only — a note says so and the send button
      // is disabled — so nothing is ever posted into nowhere. The site is
      // statically generated, so this must be set in the environment of
      // the generate step itself; changing it afterwards does nothing.
      contactFormEndpoint: '',
      // Explicit JSON acknowledgement: { ok: true } by default; providers
      // using { success: true } can select "success" instead.
      contactFormSuccessField: 'ok',
    },
  },
  compatibilityDate: '2025-07-15',

  nitro: {
    hooks: {
      'prerender:generate'(route) {
        if (route.fileName?.endsWith('.html') && route.contents) {
          route.contents = withStaticCsp(route.contents, process.env.NUXT_PUBLIC_CONTACT_FORM_ENDPOINT || '')
        }
      },
    },
    prerender: {
      crawlLinks: false,
      // Nitro does not read NITRO_PRERENDER_CONCURRENCY on its own — left
      // unset it prerenders at CPU count × 4, which on Windows races on
      // cache renames (EPERM) and fails `npm run generate`. The variable is
      // read here instead, and Windows defaults to one at a time. The site
      // is small, so serialising costs a few seconds at most.
      concurrency: Number(process.env.NITRO_PRERENDER_CONCURRENCY)
        || (process.platform === 'win32' ? 1 : undefined),
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  hooks: {
    'nitro:init'(nitro) {
      if (!nitro.options.static) return
      // i18n excludes "/" from prerendering at the domain root. Write the
      // entry after prerendering so it exists both at / and under a base path.
      nitro.hooks.hook('prerender:done', async () => {
        await writeFile(
          resolve(nitro.options.output.publicDir, 'index.html'),
          withStaticCsp(staticLocaleEntry(nitro.options.baseURL)),
        )
      })
    },
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
