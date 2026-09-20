# Deployment assumptions

- Node.js 20 or newer. Built and validated on Node 24.19.0 LTS.
- No database. Content is Git-controlled application code, not rows in a
  data store.
- npm run generate produces a static, prerendered .output/public build
  suitable for any static host or CDN. npm run build produces a Node and
  Nitro server build for environments that want SSR or dynamic routes,
  such as a future contact API. Neither is wired to a specific host yet;
  that decision is deferred.
- i18n.baseUrl in nuxt.config.ts is set to https://www.binzomah.net so
  canonical and hreflang tags resolve to absolute URLs. This domain is an
  assumption (drawn from the project's own contact-email domain,
  binzomah.net) and is not a confirmed production domain. Override it with
  the NUXT_PUBLIC_SITE_URL environment variable, or update the config
  directly, once the real domain is confirmed.
- No other environment variables are required for N01. A future contact
  API will need an email-provider credential, supplied through environment
  variables and never committed to the repository.
- No CI or CD pipeline is configured in this phase.
