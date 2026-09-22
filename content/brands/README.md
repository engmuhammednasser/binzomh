# Brand content — design permission and production gates

The owner's 2026-09-20 decisions authorize **Embryolisse**, **Zoā**, and
**RVB LAB** as the working N02 design roster. Evidence is the current
company profile; roster status remains **DRAFT / PENDING COMPANY
CONFIRMATION**. See the [owner decision record](../../docs/unresolved-content-approvals.md).

N02 may use draft brand content with neutral text placeholders carrying
these names. Do not fabricate or redraw logos.

Logo production use for these three brands is **APPROVED (2026-09-22)**,
scoped to the homepage brand teaser — see
[owner decision record](../../docs/unresolved-content-approvals.md) item 1.
All other PowerPoint-extracted logos (partner/customer logos, other
brands) remain reference-only; production use of any logo outside this
scoped approval is still **BLOCKED**.

Do not describe any brand relationship as “exclusive distributor,”
“exclusive partner,” “official distributor,” or similar contractual
language. The profile names do not establish contractual exclusivity.

Before promoting brand content to production, confirm that:

1. the roster is confirmed as current,
2. relationship terms are confirmed (never assume exclusivity),
3. an approved short description exists, and
4. an official, production-quality logo file has been supplied.

## N03 detail content

Each `content/brands/<slug>.ts` exports a `BrandProfile` from
`types/brands.ts`. `index.ts` is the single roster for the listing, detail
lookup, sitemap and existing homepage teaser. Unknown slugs return 404.
The three current entries remain draft and contain only design-approved
names. Their profiles show pending copy and a labelled 4:5 imagery study.

Introduction, relationship, image and ranges are independently optional
`BrandField<T>` values. Each has `status` and a `content` object keyed by
`en` and `ar`. `presentation.ts` renders a field only when its status is
`approved` and the current locale has content. Missing translations do not
fall back to English. Approving an entry does not approve its fields.
Empty text and ranges are omitted or use the page's neutral pending copy.

Before supplying any approved field, record the dated, scoped approval.
Images must use approved local files under `public/images/brands/` with
real dimensions and useful localized alt text. No logo assets, external
brand URLs, product claims or reference-deck content are supplied here.
Ranges are editorial category names and optional prose, never SKU grids.
The commercial enquiry CTA uses the existing localized contact route.

Run `npm run build`, `npm run test:site-origin`, and `npm run test:n03`.
The tests cover approval isolation, missing translations, locale parity,
known/unknown slugs and per-route runtime SEO origins.
