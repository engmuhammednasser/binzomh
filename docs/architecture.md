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
dev" and "npm run build" use the default Nuxt/Nitro server for development
and for any future dynamic route, such as a contact API.

## Deferred by design

See docs/unresolved-content-approvals.md for content gaps, and the final
handover message for the full list of N02+ work: homepage sections, brand
detail data, the contact backend, GSAP, imagery, structured data, and
sitemap.xml.
