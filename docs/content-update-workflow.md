# Content update workflow

1. Find, or create, the paired files under content/en/PAGE.ts and
   content/ar/PAGE.ts.
2. Edit both. Keep the shape identical: the type in types/content.ts is
   the contract. A change to one locale that is not mirrored in the other
   is a bug, not a style choice.
3. Set status honestly (draft, blocked, approved, or missing). Moving
   anything to approved should correspond to a real, dated approval for
   that specific field and use. Check the current owner decisions in
   docs/unresolved-content-approvals.md alongside the source project's
   ASSET-AND-APPROVAL-REGISTER.md and
   BILINGUAL-CONTENT-MATRIX.md first, at
   C:\xampp\htdocs\binzomh\docs\content\. The Arabic working display names
   are approved project copy; legal/trademark names remain unverified.
   Keep whole-page status draft where other copy is still pending. Contact
   details are source-confirmed, pending current company confirmation,
   and may appear only in a clearly labelled review/demo state for N02.
4. UI chrome text, such as nav labels, buttons, and aria-labels, is not
   page content. It lives instead in i18n/locales/en.json and ar.json.
   Keep both files key sets identical.
5. Run npm run typecheck. A mismatched EN/AR shape or a missing field is
   caught at compile time.
6. For brands, follow content/brands/README.md: draft N02 entries and
   neutral name placeholders are permitted for the working roster.
   Production content and assets still require the separate approvals.
