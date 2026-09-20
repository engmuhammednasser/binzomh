# Binzomah Cosmetics — corporate website

Standalone Nuxt 4 / Vue 3 / TypeScript bilingual (English / Arabic)
corporate website for Binzomah Cosmetics. No WordPress, no CMS, no
database. See `docs/` for the architecture, content, and bilingual-routing
decisions behind this foundation.

## Requirements

- Node.js 20+ (built and validated on 24.19.0 LTS)
- npm

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit `http://localhost:3000/` — it redirects to `/en/` or `/ar/` based on
saved preference / browser language (see `docs/bilingual-routing.md`).

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Static generation

```bash
npm run generate
```

## Project structure

```
app/            Nuxt application (pages, components, layouts, composables,
                middleware, assets, app.vue, app.config.ts)
content/        Typed, version-controlled EN/AR business content
i18n/           vue-i18n config and UI chrome message files (en.json/ar.json)
types/          Shared TypeScript content models
utils/          Small framework-agnostic helpers
public/         Static assets served as-is (logos, favicon, robots.txt)
server/         Nitro server routes (empty in N01 — see docs/architecture.md)
docs/           Project documentation
```

## Source material

Planning documents, the company profile, logos, and the bilingual content
matrix this project draws from live in the original WordPress project at
`C:\xampp\htdocs\binzomh\docs\`. That project is reference material only —
nothing here runs against it, and nothing there has been modified by this
project.
