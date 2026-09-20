# Deployment assumptions

- Node.js 24 is the validated runtime (24.20.0). Use it for the documented
  verification workflow; the site-origin tests import TypeScript directly
  through Node's native type stripping.
- No database. Content is Git-controlled application code, not rows in a
  data store.
- npm run generate produces a static, prerendered .output/public build
  suitable for any static host or CDN. npm run build produces a Node and
  Nitro server build for environments that want SSR or dynamic routes,
  such as a future contact API. Neither is wired to a specific host yet;
  that decision is deferred.
- The owner confirmed **https://binzomah.net** as the official production
  origin on 2026-09-20. This replaces the earlier pending decision and
  `www` assumption. The contact email is not a source of site URL config.
- `runtimeConfig.public.siteUrl` is the single canonical origin.
  Production: `NUXT_PUBLIC_SITE_URL=https://binzomah.net`.
  Local: `NUXT_PUBLIC_SITE_URL=http://localhost:3000` (see `.env.example`).
  Staging can override the same variable with its own HTTP(S) origin.
  Production defaults to the confirmed domain; the development default
  applies only to `nuxt dev`.
- Canonical, hreflang, and `og:url` paths are resolved by i18n, then
  `usePageSeo()` applies that runtime origin. Other absolute URLs use `useSiteUrl()` or
  the shared `absoluteSiteUrl()` helper. Sitemap, robots, and WebSite
  structured data consume the same setting. Future SEO features must do
  the same; do not derive URLs from the request Host header or contact email.
- `npm run build` keeps pages and SEO endpoints rendered by the server,
  so setting `NUXT_PUBLIC_SITE_URL` when starting the built Node server
  changes all their origins without a rebuild. Provide deployment
  variables to the process; the built server does not load `.env` itself.
- `npm run generate` freezes HTML, sitemap, and robots into static files.
  Set the intended origin **before generation** and regenerate when it
  changes. Static files have no server runtime override. Do not publish
  a build generated with the local development environment.
- i18n's configured base URL seeds its localized path generation. Its
  native runtime override uses a different environment variable
  (`NUXT_PUBLIC_I18N_BASE_URL`; see
  https://i18n.nuxtjs.org/docs/api/runtime-config). Applying the one site
  origin in `usePageSeo()` avoids two deployment settings drifting apart
  and avoids deprecated, non-serializable base URL callbacks. Use the
  shared SEO composable on pages instead of adding raw locale head links.
- No other environment variables are required for N01. A future contact
  API will need an email-provider credential, supplied through environment
  variables and never committed to the repository.
- No CI or CD pipeline is configured in this phase.
