# Content architecture

There is no CMS. Content is plain TypeScript, version-controlled with the
application, and typed against types/content.ts.

## Layout

content/
  en/        one file per page, English copy
  ar/        one file per page, Arabic copy, same shape as its EN pair
  brands/    draft design roster permitted; production gates in brands/README.md

Each pages EN and AR files export the same-named constant with the same
shape (for example content/en/home.ts and content/ar/home.ts both export
homeContent: HomeContent). Pages import both and pick one reactively with
the usePairedContent(en, ar) composable, which returns a computed that
follows the active i18n locale.

## Status field

Every content object carries a status:

- approved: cleared for public publication as written.
- draft: reviewable, not yet approved.
- blocked: cannot publish until a specific open decision is resolved.
- missing: no source content exists yet.

This mirrors the editorial states already tracked in the source projects
docs/content/BILINGUAL-CONTENT-MATRIX.md and
docs/content/ASSET-AND-APPROVAL-REGISTER.md, at
C:\xampp\htdocs\binzomh. Subsequent owner decisions are dated and recorded
locally in [N02 content decisions](unresolved-content-approvals.md). Use
that record for the current, explicitly scoped design permissions and
approval statuses. Do not promote an entire content object to approved
because one field has been approved: the Arabic working display names
are approved project copy, while the surrounding pages may remain draft.
Contact details are source-confirmed and pending current company
confirmation; they are not missing.

## Adding a new pages content

1. Add the type to types/content.ts if it does not exist yet.
2. Add content/en/PAGE.ts and content/ar/PAGE.ts, same shape, both with an
   honest status.
3. In the page component: import both, call usePairedContent(en, ar), and
   pass content.value.title / .intro as getters into usePageSeo().

## Adding a brand

N02 draft design entries are authorized for Embryolisse, Zoā, and RVB LAB,
using neutral text placeholders and no contractual relationship claims.
See content/brands/README.md for the production preconditions: confirmed
roster, relationship terms, approved description, and production logo file.
