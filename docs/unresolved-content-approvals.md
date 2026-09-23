# N02 content decisions and outstanding approvals

Owner decisions recorded on 2026-09-20 govern the next phase. They
supersede conflicting N01 assumptions within the scope stated below.
Evidence references are owner-provided; this update does not constitute
an independent re-verification of the company profile.

Historical evidence and approval records remain in the source project at
`C:\xampp\htdocs\binzomh\docs\content\` (`ASSET-AND-APPROVAL-REGISTER.md`
and `BILINGUAL-CONTENT-MATRIX.md`). This local record captures the owner's
subsequent decisions; the historical registers have not been updated here.
Design permission does not approve production assets, contractual claims,
or legal names.

## 1. Brand logos

Production use: **APPROVED (2026-09-22)** for the three working-roster
logos — Embryolisse, Zoā, RVB LAB — on the homepage brand teaser.

The owner confirmed the PowerPoint-extracted files as the official current
logos and directed their production use. Files were copied byte-for-byte
from the reference library (`profile company/01-logos/brands/`) into
`public/logos/brands/` with no cropping, recoloring, or background
removal — each source file carries its own flattened (non-transparent)
background, framed by the homepage teaser's logo tile rather than edited.
This approval covers only these three files for this placement; it does
not extend to the ~28 other partner/customer logos in the reference
library, nor to other pages, without a separate, scoped approval. Do not
fabricate, redraw, or imitate any logo not covered by an approval like
this one.

## 2. Brand roster and relationships

Working roster for design: **Embryolisse**, **Zoā**, **RVB LAB**.

Evidence: current company profile, as identified by the owner.
Status: **DRAFT / PENDING COMPANY CONFIRMATION**.

These names may appear as portfolio material in N02 design placeholders.
Do not use “exclusive distributor,” “exclusive partner,” “official
distributor,” or similar contractual language. The profile does not
establish contractual exclusivity for website publication. Production
roster, relationship claims, descriptions, and logo approvals remain
separate requirements; see [brand content rules](../content/brands/README.md).

## 3. Imagery

**Hero visual: SUPPLIED AND APPROVED (2026-09-20)** — the owner provided
`public/images/home/hero.png`, a designed brand visual (metallic
"Z"-ribbon geometry with the binZomah Cosmetics lockup), and directed its
use in the homepage Hero on both `/en` and `/ar`. This is a supplied
creative asset, not photography of a real facility/product, so it does
not need the "not a real facility" caveat below.

**About and Capabilities photography: SUPPLIED AND APPROVED (2026-09-22)**
— the owner separately supplied `public/images/home/about.png` (real
corporate photography, replacing the About teaser's placeholder) and
`public/images/home/capabilities-1/2/3.png` (one photo per capability
area, replacing the Capabilities teaser's placeholders), committed the
same day. This entry was missed at commit time; recorded here after the
fact from the owner's prior direction to use them on the homepage. Both
sets are approved for the homepage teasers and, as of 2026-09-22, are
also reused on the `/capabilities` page's own Hero and three sections
(same photos, same approval — no new imagery). Not yet extended to the
`/about` page's own Hero/Overview, which still show the placeholder.

**About page Hero visual: SUPPLIED AND APPROVED (2026-09-23)** — the owner
supplied `public/images/about/hero.png` (1448x1086) and directed its use in
the `/about` Hero, replacing the abstract EditorialVisual placeholder. It is
a conceptual architectural image, not documentation of a Binzomah site, so
it carries no facility claim and needs no "not a real facility" caveat —
the same footing as the homepage Hero's supplied brand visual above. It is
rendered decoratively (`alt=""`), since the heading and intro beside it
carry the section's meaning in text. The `/about` Overview still shows the
placeholder.

**Chairman portrait: REPLACED BY THE OWNER (2026-09-23)** — the 540x720
extraction from profile slide 3 was superseded on disk by a supplied
1122x1402 studio portrait at the same path. The content files' declared
`width`/`height` were corrected to match; leaving the old numbers would
have reserved the wrong box and shifted the layout on load.

**About Overview and Location visuals: SUPPLIED AND APPROVED
(2026-09-23)** — the owner supplied two further images and directed their
use on `/about`, replacing the last two EditorialVisual placeholders on the
page:

- `public/images/about/overview.png` (1086x1448, 3:4) in the Company
  Overview section.
- `public/images/about/location.png` (1536x1024, 3:2) in the "At the Heart
  of the GCC" section, where the city name is now set over it in real text
  rather than on a plain panel.

Both are conceptual images, not documentation of a Binzomah site, and both
render decoratively (`alt=""`). Neither is captioned as a facility, and no
coverage figures accompany them. Files were renamed from the owner's
section-named originals to match the project's asset conventions; the bytes
are unchanged. No EditorialVisual placeholder remains anywhere on `/about`.

Pending for all four page visuals and the eight portraits: **AVIF/WebP
derivatives have not been generated** — this project has no image tooling,
so the originals ship as supplied. That is roughly 9 MB across the About
page, about 2.1 MB of it the eagerly-loaded Hero PNG. Generating
derivatives (or supplying JPEGs) is by a wide margin the largest
performance item on this page.

Warehouse and channel photography: **NOT APPROVED**.

Use intentional, high-quality design placeholders where final approved
imagery is unavailable. Define each placeholder's aspect ratio and
content purpose in the design. Do not present random stock photography as
Binzomah facilities. PowerPoint imagery is visual reference only unless
later explicitly approved for public use.

## 4. Company chronology

Working interpretation for planning only:

- **1970:** group/family-business origin referenced in the profile.
- **2015:** the Group's first cosmetics enterprise launched as Cozma Care.
- **2021:** rebranding/transformation to Binzomah Cosmetics and a strategic
  shift toward dermo-cosmetics.

Founding language: **RESOLVED (2026-09-23)**. The owner confirmed that the
earlier year is the founding year and the later year is the rebranding —
**founded 1970, rebranded to Binzomah Cosmetics in 2021**. Slide 2's
“Established in 2015” describes the Group's first cosmetics enterprise
(Cozma Care), not the founding of Binzomah, so the two statements are no
longer treated as contradictory. The /about timeline may state this
sequence as documented.

Still open: the **legal entity names** “RMZ Holding Company” and “BINZOMAH
Group” remain **UNCONFIRMED** and stay out of published copy — the owner's
decision covered the dates, not the corporate structure. Do not present
1970, 2015, or 2021 as a prominent homepage statistic.

## 5. Metrics

All current company metrics: **BLOCKED FOR PUBLIC DISPLAY** pending
company approval. Profile candidates are recorded here for layout planning
only:

- 70+ cities covered
- 3000+ retail points
- 2 warehouses
- 100+ delivered orders/day distribution capacity
- 50% annual sales growth

Do not render these values in public N02 designs. Either omit the metrics
section or use explicitly labelled design placeholders without fake
numbers. Other metrics, including years in market, remain blocked too.

## 6. Contact details

Public display: **APPROVED (2026-09-23)** for the three profile-sourced
details below, plus working hours supplied by the owner in the same
decision. This supersedes the earlier "labelled review/demo state only"
restriction, and the footer's "Draft — pending confirmation" badge on the
address was removed with it.

- Phone: +966 50 006 4807
- Email: info@binzomah.net
- Address: Sahafa District – Anas Ibn Malek Road – Riyadh – Saudi Arabia
- Working hours: Sunday – Thursday, 9:00 AM – 6:00 PM

The owner confirmed these are the current, publishable details and
directed their display in the site footer. Values live in
`content/en/contact.ts` / `content/ar/contact.ts` and are rendered by
`app/components/global/AppFooter.vue` (phone as a `tel:` link, email as
`mailto:`). Working hours have no other source in this project — the
owner's statement is the record.

Still **BLOCKED**: the `/contact` page's partnership enquiry form, which
has no approved submission backend. That page stays `status: 'blocked'`.

Social profiles: **NOT AVAILABLE**. The owner confirmed on 2026-09-23 that
no official profile URLs are ready. Do not create a social URL from
`@Binzomah Cosmetics`; its platform is unidentified. `content/social.ts`
is intentionally empty and the footer's "Follow Us" block renders nothing
until real, company-supplied URLs are added there. Platform glyphs are
rendered as plain text names, not redrawn marks — see the item 1 caution,
which applies to third-party platform logos too.

## 7. Official domain

**PRODUCTION DOMAIN = CONFIRMED: https://binzomah.net**.

The owner's subsequent domain decision on 2026-09-20 supersedes the
earlier pending status. This confirmation is explicit, not derived from
the contact email. The canonical production host has no `www` prefix.

- Production: `NUXT_PUBLIC_SITE_URL=https://binzomah.net`
- Local development: `NUXT_PUBLIC_SITE_URL=http://localhost:3000`
- Staging: override the same variable with that environment's origin.

Use the configured origin for canonical, hreflang, Open Graph, sitemap,
and structured-data URLs, and any future robots/sitemap configuration.
Keep runtime overrides supported; do not bake localhost into production
output. See [deployment assumptions](deployment-assumptions.md) for the
difference between server builds and static generation.

## 8. Arabic display name

- Working brand name: **بنزوما**.
- Full working website display name: **بنزوما كوزمتكس**.
- Arabic working display copy: **APPROVED FOR PROJECT DESIGN/CONTENT COPY**
  by the owner on 2026-09-20.
- Registered legal/trademark Arabic name: **UNVERIFIED**.

Use the short or full working name as appropriate in N02 Arabic copy.
Do not describe either as a registered legal or trademark name without
formal company documentation. Legal-name verification does not block N02.
This approval applies to the display-name fields, not to whole pages or
unrelated draft content.

## 9. Channel partner / customer logos

Production use: **APPROVED (2026-09-22)** for 25 named entries, on the
`/network` page's "Clients & partners" section, **and** (approved the same
day, extending scope) as an 8-logo curated preview in the homepage's
Network teaser section (`content/en/home.ts` / `content/ar/home.ts`
`network.logos`) — a subset of the same 25, not new assets.

The owner approved display of the identifiable client/partner logos from
the company profile's channel slides (pharmacies, e-commerce, hospitals,
wholesale, cosmetics stores) — see `content/en/network.ts` and
`content/ar/network.ts` for the exact roster. Files were copied
byte-for-byte from the reference library
(`profile company/01-logos/partners-and-customers/`) into
`public/logos/partners/` with no cropping, recoloring or background
removal.

Explicitly **excluded** from this approval, and still **BLOCKED**:

- The 3 unidentified generic marks in the same reference folders
  (`wholesale-mark-01`, `wholesale-mark-02`, `cosmetics-store-mark-12`) —
  no confirmed company name exists for these.
- Any use of these logos, or any other partner/customer logo in the
  reference library, on a page other than `/network` and the homepage
  Network teaser, without a separate, scoped approval.
- Any relationship language beyond reproducing the company profile's own
  listing (see the "Brand roster and relationships" caution in item 2,
  which applies equally here) — logo presence does not establish or claim
  a current, verified commercial relationship. The displayed copy
  (`partners.note` in both locale files) states this explicitly.

## 10. Leadership and team

Public display: **APPROVED (2026-09-23)** for the chairman and the seven
named managers from the company profile, on the `/about` page's Leadership
section — names, job titles, portraits, and the chairman's biography and
quote.

The owner directed publication of the people on profile slides 3 (Our
Chairman) and 9 (Meet The Team). This replaces the section's previous
status, which was a structural placeholder explicitly forbidden from
carrying any name, photo, or biography.

Portraits were copied byte-for-byte from the reference library
(`profile company/02-photos/leadership/` and `.../team/`) into
`public/images/about/` with no cropping, recoloring, or retouching. The
grid applies a CSS `object-fit` crop to a shared 3/4 box for alignment —
a presentational frame, not an edit to the files.

Each portrait is matched to its person from the slide 9 XML groups rather
than from text order: every card in that slide wraps one image with one
name and one title, so the pairing is unambiguous and verifiable. The
source's “HEAD OF FINACNE AND ACCOUNTING” typo is corrected to “Finance”.

Explicitly **excluded** from this approval, and still **BLOCKED**:

- The chairman biography's “owner of RMZ Holding, which owns five
  companies” — the legal entity names stay unconfirmed under item 4.
- Any person not named on slides 3 or 9. Never invent a colleague, a title,
  or a portrait to fill out a grid.
- Reuse of these portraits on any other page without a separate, scoped
  approval.

Pending, not blocking: AVIF/WebP derivatives have not been generated for
these eight files (no image tooling in this project), so the originals ship
as supplied — about 1.5 MB in total, lazy-loaded below the fold.

## Other continuing N01 assumptions

The palette and typography in [design tokens](design-tokens.md) remain a
working direction, not signed-off branding. The owner decisions above do
not change that status.
