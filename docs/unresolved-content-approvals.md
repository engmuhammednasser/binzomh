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

Production use: **BLOCKED**.

PowerPoint-extracted logos are reference-only and must not be published as
production assets. For N02, use neutral text placeholders carrying the
names **Embryolisse**, **Zoā**, and **RVB LAB**. Do not fabricate, redraw,
or imitate their logos.

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

Final hero, warehouse, and channel photography: **NOT APPROVED**.

Use intentional, high-quality design placeholders in N02. Define each
placeholder's aspect ratio and content purpose in the design. Do not
present random stock photography as Binzomah facilities. PowerPoint
imagery is visual reference only unless later explicitly approved for
public use.

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

## Other continuing N01 assumptions

The palette and typography in [design tokens](design-tokens.md) remain a
working direction, not signed-off branding. The owner decisions above do
not change that status.
