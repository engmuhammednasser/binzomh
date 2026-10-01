# Deployment assumptions

- Node.js 24 is the validated runtime (24.20.0). Use it for the documented
  verification workflow; the site-origin tests import TypeScript directly
  through Node's native type stripping.
- No database. Content is Git-controlled application code, not rows in a
  data store.
- npm run generate produces a static, prerendered .output/public build
  suitable for any static host or CDN. npm run build produces a Node and
  Nitro server build for environments that want SSR or dynamic routes,
  such as a future contact API. The current CI deploys the static output to
  GitHub Pages; the final production domain/proxy configuration is separate.
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
- `NUXT_PUBLIC_CONTACT_FORM_ENDPOINT` sets where the contact form posts.
  It is public (a URL a browser posts to, not a credential) and is baked
  in at generate time; unset, the form ships display-only. Any future
  server-side contact API needing an email-provider credential must take
  it from environment variables and never commit it.
- CI/CD: `.github/workflows/deploy-pages.yml` runs on every push to
  `main`. It installs with `npm ci`, runs lint, typecheck, build and the
  test suite as a gate, then generates the static site under
  `NUXT_APP_BASE_URL=/<repo>/` and publishes it to GitHub Pages.
  GitHub Pages does not apply custom `_headers` files. The HTTP header
  configuration below belongs to whichever host or proxy fronts the final domain.

## Audit remediation (2026-09-30)

- Contact sending remains disabled by owner decision: no approved destination
  exists. Before enabling it, verify provider-side validation, spam/rate limits,
  allowed browser origins and privacy handling. Set the endpoint at generate
  time and select `NUXT_PUBLIC_CONTACT_FORM_SUCCESS_FIELD=ok` (default) or
  `success` for the provider's explicit JSON acknowledgement. Empty JSON, HTML,
  negative acknowledgements and non-2xx responses are failures. A successful
  acknowledgement means the enquiry was received, not that an email was delivered.
- The generated root is a small language entry page: saved `binzomh_locale`
  takes precedence over browser language, then English. It preserves query/hash
  and the deployment base path. Real language links work without JavaScript.
  Explicit `/en/...` and `/ar/...` routes retain their own language.
- SSR HTML responses include a CSP with hashes of the rendered inline scripts,
  `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, a strict-origin
  referrer policy and disabled camera/microphone/geolocation. Development does
  not enforce this policy so Nuxt devtools/HMR can work.
- Static HTML contains a CSP meta tag before scripts. It permits scripts from
  the site and hashed Nuxt bootstrap/payload scripts, blocks plugins/objects,
  and limits connections/form actions to the site plus the configured contact
  origin. Inline styles are permitted because Vue uses style attributes.
- Meta CSP cannot enforce `frame-ancestors`; it also cannot supply `nosniff` or
  Permissions-Policy. `public/_headers` supplies these for compatible static
  hosts. On GitHub Pages, apply those rules at a fronting proxy before calling
  the deployment fully hardened. Verify actual deployed response headers.
  Enable HTTPS enforcement at the host; decide HSTS only after confirming all
  affected domains support HTTPS. No hosting settings were changed by this fix.
- After changing bootstrap scripts, always regenerate: CSP hashes are generated
  from each final HTML file. A proxy must not rewrite/minify inline scripts
  afterwards. New remote fonts, analytics or form providers require a deliberate
  policy update and browser verification.
- CI now runs SSR browser tests before generation and static browser tests after
  generation, both at desktop/mobile sizes in English/Arabic. Any failed gate
  stops deployment. Browser tests use local mocks and do not contact a provider.


## Optional Node dashboard (2026-09-30)

`npm run build:admin` produces an authenticated CMS version of the entire site with SQLite-backed content. It requires a Node 24.20+ service, HTTPS, private persistent storage, an owner created via CLI and backups. See `layers/admin/README.md` for setup, security configuration and recovery. The static Pages workflow remains source-based; publishing in a Node dashboard does not change the separate GitHub Pages deployment. Dashboard API/browser checks run in a separate CI job before Pages deployment. No production host or DNS change has been made.
