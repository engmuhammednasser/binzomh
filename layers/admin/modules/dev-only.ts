import { defineNuxtModule } from 'nuxt/kit'
import type { NuxtPage } from 'nuxt/schema'

/** Keep the dashboard out of public builds; enable it only for development or an explicit Node CMS build. */
export default defineNuxtModule({
  meta: { name: 'admin-build-gate' },
  setup(_options, nuxt) {
    const enabled = nuxt.options.dev || process.env.NUXT_ADMIN_ENABLED === 'true'
    nuxt.options.runtimeConfig.admin.enabled = enabled
    nuxt.options.runtimeConfig.public.adminEnabled = enabled
    nuxt.hook('nitro:config', (config) => {
      if (config.static && enabled) throw new Error('The dashboard requires a Node server. Unset NUXT_ADMIN_ENABLED before generating the public static site.')
    })
    // `nuxt prepare` (and so `nuxt typecheck`) only generates types; it
    // ships nothing. The admin pages are still type-checked there, which
    // needs their layout to stay in the generated types.
    if (enabled || nuxt.options._prepare) return

    nuxt.hook('pages:extend', (pages) => {
      const isAdmin = (page: NuxtPage) => page.path === '/admin' || page.path.startsWith('/admin/')
      for (let i = pages.length - 1; i >= 0; i--) {
        if (isAdmin(pages[i]!)) pages.splice(i, 1)
      }
    })

    // Layouts are bundled independently of the pages that use them, so
    // the admin shell (and the stylesheet it imports) would still ship as
    // an unreachable chunk. Dropping it from the resolved app removes it.
    nuxt.hook('app:resolve', (app) => {
      delete app.layouts.admin
    })
  },
})
