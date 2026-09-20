# Brand content — design permission and production gates

The owner's 2026-09-20 decisions authorize **Embryolisse**, **Zoā**, and
**RVB LAB** as the working N02 design roster. Evidence is the current
company profile; roster status remains **DRAFT / PENDING COMPANY
CONFIRMATION**. See the [owner decision record](../../docs/unresolved-content-approvals.md).

N02 may use draft brand content with neutral text placeholders carrying
these names. Do not fabricate or redraw logos. PowerPoint-extracted logos
remain reference-only; production logo use is **BLOCKED**.

Do not describe any brand relationship as “exclusive distributor,”
“exclusive partner,” “official distributor,” or similar contractual
language. The profile names do not establish contractual exclusivity.

Before promoting brand content to production, confirm that:

1. the roster is confirmed as current,
2. relationship terms are confirmed (never assume exclusivity),
3. an approved short description exists, and
4. an official, production-quality logo file has been supplied.

For brand content, use `content/brands/<slug>.ts` exporting a
`BrandContent` (see `types/content.ts`), paired for English and Arabic in
the same file (brand-facing fields like `name` are typically shared across
locales; only prose fields need EN/AR pairs — extend the type if a field
needs full localization). Keep design entries `draft`, leave the logo
unset until approved, and do not interpret design permission as approval
to publish production brand content.
