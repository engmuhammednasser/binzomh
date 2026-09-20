# Content update workflow

1. Find, or create, the paired files under content/en/PAGE.ts and
   content/ar/PAGE.ts.
2. Edit both. Keep the shape identical: the type in types/content.ts is
   the contract. A change to one locale that is not mirrored in the other
   is a bug, not a style choice.
3. Set status honestly (draft, blocked, approved, or missing). Moving
   anything to approved should correspond to a real, dated approval.
   Check the source projects ASSET-AND-APPROVAL-REGISTER.md and
   BILINGUAL-CONTENT-MATRIX.md first, at
   C:\xampp\htdocs\binzomh\docs\content\.
4. UI chrome text, such as nav labels, buttons, and aria-labels, is not
   page content. It lives instead in i18n/locales/en.json and ar.json.
   Keep both files key sets identical.
5. Run npm run typecheck. A mismatched EN/AR shape or a missing field is
   caught at compile time.
6. Brands are the one content type with an extra gate: do not add a file
   under content/brands/ until the preconditions in
   content/brands/README.md are met.
