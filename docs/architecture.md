# Architecture decisions (N01 foundation)

## Stack

Nuxt 4 (Vue 3, TypeScript, Nitro/Node), no CMS, no database. Native CSS
with custom properties, no Tailwind/Bootstrap/UI component framework.

## Why app/ as the source directory

Nuxt 4's default convention nests pages/, components/, composables/,
layouts/, middleware/, utils/, assets/, app.vue, and app.config.ts under
app/ (the srcDir). This project follows that default rather than fighting
the framework. content/, types/, i18n/, server/, public/, and docs/ stay
at the project root, alongside app/, since they are not Vue application
code.

## Why @nuxtjs/i18n

The bilingual routing rules (docs/bilingual-routing.md) are detailed and
SEO-sensitive: explicit-locale URLs must never be overridden by browser
detection, root-level detection must respect a saved preference over the
browser header, and every page needs correct hreflang and canonical tags
with no cross-language canonicalization. @nuxtjs/i18n is the standard,
actively maintained Nuxt module for exactly this, and its strategy:
"prefix" plus detectBrowserLanguage options implement those rules
directly, instead of reimplementing locale-redirect middleware and SEO
head tags by hand. It is the one dependency added beyond the brief's
default list, because it solves an explicitly specified, non-trivial
requirement rather than adding convenience.

No other module was added by default: no UI kit, no CMS, no animation
library, no state library. Plain ref/computed/useState cover the
foundation's needs, so Pinia was not added.

## Rendering strategy

Informational pages are static-friendly. "npm run generate" prerenders the
site; Nitro's crawler follows the header/footer navigation from the seeded
/, /en, /ar routes to reach every other page in both locales. "npm run
dev" and "npm run build" use the default Nuxt/Nitro server. Server builds
do not prerender these pages, so deployment-time NUXT_PUBLIC_SITE_URL
overrides and the root locale redirect remain effective. Static generation
also emits sitemap.xml and robots.txt using the generation-time origin.
See docs/deployment-assumptions.md for both deployment modes.

## Canonical origin

The owner-confirmed production origin is https://binzomah.net. All emitted
first-party SEO URLs use runtimeConfig.public.siteUrl, overridable with
NUXT_PUBLIC_SITE_URL. usePageSeo keeps i18n's localized paths and applies
that origin to canonical, hreflang, and Open Graph URL tags. Shared
absoluteSiteUrl/useSiteUrl helpers serve sitemap, robots, WebSite structured
data, and future absolute URL consumers. No URL is derived from email or
the incoming Host header.

Verify server overrides after a build with `npm run test:site-origin`.

## Deferred by design

See docs/unresolved-content-approvals.md for content gaps, and the final
handover message for the full list of later work: approved brand detail
data, the contact backend, animation-library decisions, production imagery,
and richer structured data. A sitemap, robots endpoint, and minimal WebSite
structured data are now implemented using the configured origin.
