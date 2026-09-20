# N03: Brands and Network

This implementation is scoped to the Brands listing, reusable Brand Detail
page, Network page and their route/content tests. About, Capabilities,
shared motion and the contact backend are outside this scope.

## Brand presentation

The owner's working design roster is Embryolisse, Zoā and RVB LAB. Brand
names use ordinary typography, not recreated logos. Commercial
relationships remain pending company confirmation. Each known slug has
a bilingual profile; unknown slugs return 404, including on client-side
navigation. See `content/brands/README.md` for the typed field approvals
and missing-content rules. No brand history, origin, product claims or
external URLs have been invented.

## Network presentation

Paired files under `content/en/network.ts` and `content/ar/network.ts`
describe pharmacies, e-commerce, hospitals, wholesale and cosmetics
stores. These are customer/distribution channels, not Binzomah-owned
locations. The page uses static editorial sections and real anchor links;
it has no location finder, map, metrics or fabricated client logos.

The client/partner area is explicitly pending. Its typed `names` list is
empty in both locales and only entries with `status: 'approved'` render.
Supplying partner names requires publication approval in each locale.
All new content remains draft; implementation is not publication approval.

## Integration surface and verification

No shared components, global styles, Nuxt config, site-origin helpers or
shared content types were changed. Shared changes are limited to a
`test:n03` script, known brand paths in the sitemap and the existing
site-origin test's sitemap count/shared test-server helper. The homepage
roster export preserves its existing shape.

Use Node.js 24 and install the lockfile dependencies in this worktree.
Run `npm run typecheck`, `npm run lint`, `npm run build`,
`npm run test:site-origin` and `npm run test:n03`. Tests use Node's built-in
runner and the built server; there are no new test dependencies.

N03 tests exercise the listed pages and all three brand slugs in EN/AR,
unknown-slug 404s, localized metadata, canonical/hreflang targets,
production and staging origins, sitemap entries and unapproved-content
omission. The existing origin suite also covers local runtime overrides.

## Validation completed on 2026-09-20

- Typecheck, lint, production build and whitespace checks passed.
- Existing site-origin suite: 4 passed. N03 content/route suite: 6 passed.
- HTTP checks cover `/en/brands`, `/ar/brands`, `/en/network`,
  `/ar/network`, every known brand in both locales and unknown-brand 404s.
- Browser smoke checks cover desktop and 320px layouts, Arabic direction,
  client-side locale/brand navigation, visible keyboard focus, Network
  anchor targets below the sticky header and localized 404 recovery.
  No hydration, unresolved-component or other runtime errors were observed
  on valid pages. These are smoke checks, not exhaustive visual QA.

No implementation blockers remain. Production brand descriptions,
relationship copy, images/ranges and named clients/partners still need
approval. Their pending states are intentional.

## Changed-file inventory

```text
app/components/brands/Detail.vue
app/components/brands/Imagery.vue
app/components/brands/Portfolio.vue
app/components/network/Channels.vue
app/components/network/Experience.vue
app/pages/brands/[slug].vue
app/pages/brands/index.vue
app/pages/network.vue
content/ar/brands.ts
content/ar/network.ts
content/brands/README.md
content/brands/embryolisse.ts
content/brands/index.ts
content/brands/presentation.ts
content/brands/rvb-lab.ts
content/brands/zoa.ts
content/en/brands.ts
content/en/network.ts
docs/n03-codex.md
package.json
server/routes/sitemap.xml.ts
tests/brand-content.test.mjs
tests/helpers/server.mjs
tests/n03-routes.test.mjs
tests/site-origin.test.mjs
types/brands.ts
types/network.ts
```
