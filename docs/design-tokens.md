# Design tokens

For token layers, component usage, typography rules and verification, read the
[design system guide](design-system.md). Keep those rules there rather than
maintaining a second copy in this document.

## Current sources

- `app/assets/css/tokens.css`: public palette, semantic roles and shared scales.
- `app/assets/css/main.css` and `reset.css`: global type, layout and focus rules.
- `app/assets/css/fonts.css`: local Cairo font-face declarations.
- `layers/admin/app/assets/admin-tokens.css`: shared admin feedback tokens only.
- `layers/admin/app/assets/admin-workspace.css`: workspace theme overrides and controls.

The global stylesheet is loaded through `nuxt.config.ts`. Admin workspace and
login stylesheet boundaries are documented in the guide; not all project tokens
live in the public token file. Preserve existing values when moving a declaration
into a semantic token.

## Company logo usage

`app/components/base/BaseLogo.vue` selects `public/logos/binzomah-logo-dark.png`
or `public/logos/binzomah-logo-light.png`. Its source map records separate dimensions
of 1252 x 329 and 1254 x 323, respectively; the image keeps automatic inline size.
The light variant adds `margin-block-start: 0.06em`. Preserve these variant-specific
dimensions and alignment when reusing the component. This concerns the company
logo component, not the separate brand/partner logo registries.
