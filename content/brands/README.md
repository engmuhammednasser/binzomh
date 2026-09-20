# Brand content — intentionally empty

No brand content files exist here yet. The source register marks the
current three-brand roster (Embryolisse, Zoā, RVB LAB) as `BLOCKED`: their
relationship terms, approved descriptions, and production logo files are
all unconfirmed, and the only logo artwork found is a non-production
extraction from a presentation deck. See
`C:\xampp\htdocs\binzomh\docs\content\ASSET-AND-APPROVAL-REGISTER.md`.

Do not add a brand file here until:

1. the roster is confirmed as current,
2. relationship terms are confirmed (never assume exclusivity),
3. an approved short description exists, and
4. an official, production-quality logo file has been supplied.

When a brand is approved, add `content/brands/<slug>.ts` exporting a
`BrandContent` (see `types/content.ts`), paired for English and Arabic in
the same file (brand-facing fields like `name` are typically shared across
locales; only prose fields need EN/AR pairs — extend the type if a field
needs full localization).
