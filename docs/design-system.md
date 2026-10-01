# Design system

`layers/admin/app/assets/admin-tokens.css` holds shared admin tokens only.
Page and workspace styles must never go there. Workspace styles belong in
`admin-workspace.css`; page-specific styles stay with their page or component.

Use `BaseButton`'s `primary-bordered` variant for primary actions on dark or
inverse surfaces. Sections must use this variant instead of overriding the
button's `border-color`. Preserve this rule when expanding the guide in Step 8.
