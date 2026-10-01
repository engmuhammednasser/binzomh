# Architecture

## Stack and boundaries

This is a Nuxt 4 / Vue 3 / TypeScript application with a Nitro server and an
optional CMS backed by SQLite. `package.json` requires Node >=24.20.0 and includes
`@nuxtjs/i18n`, ESLint, Playwright and Sharp. Styling uses native CSS and custom
properties; no UI kit, Tailwind, Pinia or animation library is declared.

- `app/`: public pages, layouts, section/base components and composables.
- `layers/admin/`: dashboard UI, translations and its build gate.
- `server/cms/`: persistence, sessions, validation and workspace revisions.
- `server/api/`: public-content and authenticated admin endpoints.
- `content/`: versioned bilingual defaults, brand roster and image registry.
- `types/`: content, image and CMS contracts.
- `shared/utils/`: pure helpers used across client/server boundaries, including
  contact validation. These helpers do not import application, admin or server code.

The admin layer is already an architectural boundary; it is not a proposed
design-system layer. See [content architecture](content-architecture.md) for data flow.

## Build and deployment modes

`layers/admin/modules/dev-only.ts` enables the dashboard in development or when
`NUXT_ADMIN_ENABLED=true`. Otherwise it removes admin pages and the admin layout
from the application build. CMS handlers additionally check the server-side
`runtimeConfig.admin.enabled` flag and return 404 when disabled.

`npm run build:admin` sets that environment flag and produces a Node server build.
CMS operation requires writable, persistent SQLite storage; its default path is
`.data/admin.sqlite`, configured by `runtimeConfig.admin.dbPath`. Account creation
and backups have separate `admin:account` and `admin:backup` scripts.

With admin disabled, `npm run generate` produces a public static site from the
versioned content. `nuxt.config.ts` seeds `/`, `/en`, `/ar`, sitemap and robots
routes with the configured base path, enables link crawling for generation, and
writes the static root locale entry. The admin build gate rejects static generation
with admin enabled.
Normal server builds do not prerender those public pages.

The checked-in `.github/workflows/deploy-pages.yml` deploys `.output/public` to
GitHub Pages. Its separate dashboard job builds/tests the CMS; it does not deploy
a Node CMS server. There is no implemented SQLite-to-static-content export in this
flow: publishing a CMS draft does not update a GitHub Pages deployment.

## CMS storage and request boundaries

`server/cms/database.ts` uses Node's `DatabaseSync`, WAL mode and tables for users,
sessions, login attempts, workspace, revisions, enquiries and media. Workspace
draft/published values are stored as JSON; processed upload bytes are stored in
the media table. `server/cms/store.ts` seeds a missing workspace, checks the expected
revision and wraps save/publish/restore in transactions; stale writes return 409.

`server/cms/auth.ts` checks database sessions, expiry and inactivity, and uses an
HttpOnly, SameSite=Strict session cookie. Its Secure attribute follows configuration.
Authenticated mutations also require a matching origin and CSRF token. Password
hashing lives in `server/cms/password.ts`. These mechanisms are not a claim that
every admin workflow is defect-free; open issues are recorded in
[known issues](known-issues.md).

`GET /api/content` returns the filtered published workspace without requiring login
when CMS is enabled. `GET /api/admin/preview` requires a session and returns the
filtered saved draft. Public route middleware loads these into Nuxt state for SSR
and hydration; ordinary static/public builds keep using the versioned defaults.

The public contact form is separate from the admin enquiries API. Its configured
endpoint defaults to empty, and `useContactSubmission()` refuses to send without
one. `POST /api/admin/enquiries` requires an admin session and CSRF token; it is
for manual dashboard entry, not an anonymous contact receiver. No sending provider
is configured by this documentation change.

## Locale and SEO

`nuxt.config.ts` configures prefixed EN/AR routes and browser detection at the root.
`app/app.vue` applies locale `lang`/`dir`; `usePageSeo()` applies
`runtimeConfig.public.siteUrl` to localized canonical, alternate and Open Graph URLs.
The configured production default is `https://binzomah.net`; server deployments can
override it with `NUXT_PUBLIC_SITE_URL`. Static generation freezes configuration at
generation time. `useSiteUrl()` and `shared/utils/site-url.ts` also support sitemap,
robots and WebSite structured data without deriving the origin from the request Host.
