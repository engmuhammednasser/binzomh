# Content architecture

There is no CMS. Content is plain TypeScript, version-controlled with the
application, and typed against types/content.ts.

## Layout

content/
  en/        one file per page, English copy
  ar/        one file per page, Arabic copy, same shape as its EN pair
  brands/    empty until a brand is approved, see brands/README.md

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
C:\xampp\htdocs\binzomh. Do not flip a draft or blocked entry to approved
here without a corresponding dated approval in that register.

## Adding a new pages content

1. Add the type to types/content.ts if it does not exist yet.
2. Add content/en/PAGE.ts and content/ar/PAGE.ts, same shape, both with an
   honest status.
3. In the page component: import both, call usePairedContent(en, ar), and
   pass content.value.title / .intro as getters into usePageSeo().

## Adding a brand

Not authorized yet. See content/brands/README.md for the exact
preconditions: confirmed roster, relationship terms, approved description,
production logo file.
