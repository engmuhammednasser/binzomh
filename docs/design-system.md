# Design system

`layers/admin/app/assets/admin-tokens.css` holds shared admin tokens only.
Page and workspace styles must never go there. Workspace styles belong in
`admin-workspace.css`; page-specific styles stay with their page or component.
