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

This follows the profile timeline, while slide 2 separately describes
Binzomah Cosmetics as “Established in 2015.” Public-facing founding
language remains **COMPANY_CONFIRMATION_REQUIRED**. Do not present 1970,
2015, or 2021 as a prominent homepage statistic.

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

Status: **SOURCE-CONFIRMED FROM PROFILE / PENDING CURRENT COMPANY
CONFIRMATION**. These details are not missing:

- Phone: +966 50 006 4807
- Email: info@binzomah.net
- Address: Sahafa District – Anas Ibn Malek Road – Riyadh – Saudi Arabia

N02 may show these only in a clearly labelled review/demo state when
needed to evaluate layout. They are not approved production contact data.
Do not create a social URL from `@Binzomah Cosmetics`; its platform is
unidentified.

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

## Other continuing N01 assumptions

The palette and typography in [design tokens](design-tokens.md) remain a
working direction, not signed-off branding. The owner decisions above do
not change that status.
