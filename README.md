# Binzomah Cosmetics — corporate website

Standalone Nuxt 4 / Vue 3 / TypeScript bilingual (English / Arabic)
corporate website for Binzomah Cosmetics. No WordPress, no CMS, no
database. See `docs/` for the architecture, content, and bilingual-routing
decisions behind this foundation.

## Requirements

- Node.js 24 — what CI uses and the tests are validated on (they import
  TypeScript files directly, which older Node versions cannot run)
- npm

## Setup

```bash
npm ci
```

`npm ci` installs exactly what `package-lock.json` records. Prefer it over
`npm install`, which can drift from the lockfile and make local type
checks disagree with CI.

## Development

```bash
npm run dev
```

Visit `http://localhost:3000/` — it redirects to `/en/` or `/ar/` based on
saved preference / browser language (see `docs/bilingual-routing.md`).

## Checks

```bash
npm run lint
npm run typecheck
npm run build
npm test        # needs the output of `npm run build`
npx playwright install chromium
npm run test:browser
```

The GitHub Pages workflow runs these checks, generates the static site, then
repeats the applicable browser tests against the generated deployment path.
Browser tests cover desktop/mobile, EN/AR, hydration, navigation, motion and
contact failures using an intercepted local endpoint. They never send real mail.
Traces and screenshots from failures are saved under `test-results/` (ignored).

## Static generation

```bash
npm run generate
```

To test generated output, run `npm run test:static`, then `npm run test:browser` with `E2E_STATIC=1` and
`E2E_BASE_PATH` matching the generation's `NUXT_APP_BASE_URL` (default `/`).
In PowerShell, set these with `$env:E2E_STATIC='1'` and
`$env:E2E_BASE_PATH='/binzomh/'` before the command, and remove them afterwards.
The static tests currently require the contact endpoint to remain unset, as
requested by the owner; update that assertion when a provider is approved.

Pushing to `main` generates and publishes the site to GitHub Pages
(`.github/workflows/deploy-pages.yml`). The contact form's endpoint is
read from the repository variable `CONTACT_FORM_ENDPOINT` at generate time
and baked into the HTML — see `.env.example`.
Keep it unset until a provider is approved. Success requires HTTP 2xx,
`application/json`, and explicit `{ "ok": true }`. Providers using
`{ "success": true }` need `CONTACT_FORM_SUCCESS_FIELD=success` too.
Empty/ambiguous replies never clear the form. See `docs/deployment-assumptions.md`
for CSP and the headers that still require hosting configuration.

## Project structure

```
app/            Nuxt application (pages, components, layouts, composables,
                middleware, assets, app.vue, app.config.ts)
content/        Typed, version-controlled EN/AR business content
i18n/           vue-i18n config and UI chrome message files (en.json/ar.json)
types/          Shared TypeScript content models
utils/          Small framework-agnostic helpers
public/         Static assets served as-is (logos, favicon, robots.txt)
server/         Nitro SEO routes and response security policies
docs/           Project documentation
```

## Source material

Planning documents, the company profile, logos, and the bilingual content
matrix this project draws from live in the original WordPress project at
`C:\xampp\htdocs\binzomh\docs\`. That project is reference material only —
nothing here runs against it, and nothing there has been modified by this
project.


## Authenticated content dashboard

The Node dashboard supports durable drafts, private preview, publication, image uploads, revision restore and enquiry tracking. See [dashboard setup and deployment](layers/admin/README.md). Create the owner with `npm run admin:account -- --email=owner@example.com`, then use `npm run dev` and `/ar/admin/login`. Production uses `npm run build:admin` with HTTPS and a persistent SQLite volume. The normal GitHub Pages build still excludes the dashboard; its static files do not receive database publications.
