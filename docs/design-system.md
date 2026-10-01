# Design system

## Scope and token layers

Use the existing native CSS system for this single project. Preserve palette
values during refactors; the working palette is not a new brand approval.
The public site has a light theme; the admin workspace has its own dark theme.
No new UI library or design-system Nuxt layer is introduced by this cleanup.

The current flow is palette -> semantic token -> component styles/variants:

- `app/assets/css/tokens.css` defines raw `--palette-*` values and semantic roles,
  plus typography, spacing, radius, shadow and motion scales.
- Example: `--palette-ink-600` -> `--color-action-hover` -> primary button hover.
- Components consume semantic roles such as `--color-text`, `--color-bg-inverse`
  and `--shadow-media`. There is no separate component-token registry today.

Reuse a token when its meaning fits, not merely because its value matches.
If none fits, propose a named semantic token in the owning theme. Add a component
token only for a real customization need; do not create aliases for every literal.
Existing raw values remain outside this scoped cleanup; do not treat that as a
pattern for new work.

## Public and admin themes

`nuxt.config.ts` loads `app/assets/css/main.css`, which imports the public tokens,
reset and local fonts. These global foundations also load on admin routes.

`layers/admin/app/assets/admin-tokens.css` holds shared admin tokens only:
the error background, regular/strong error text and success border. Keep the
two error-text roles distinct; they retain their different existing colors.

Page and workspace styles must never go into `admin-tokens.css`.
`admin-workspace.css` imports it and defines workspace theme overrides and controls;
`layers/admin/app/layouts/admin.vue` loads that workspace stylesheet.
The standalone login imports only `admin-tokens.css` directly and keeps its page
styles in `login.vue`. Do not import full workspace styles into login or move
admin feedback colors into the public token file.

## BaseButton and section composition

`app/components/base/BaseButton.vue` owns these variants:

| Variant | Existing treatment |
| --- | --- |
| `primary` (default) | Filled inverse background; semantic hover background. |
| `primary-bordered` | Same primary fill/hover, with a visible on-dark border. |
| `secondary` | Transparent background with a border. |
| `text` | Underlined text with no horizontal padding. |

Use `primary-bordered` for primary actions on dark/inverse surfaces.
Sections must use it instead of overriding `border-color`. It replaces the same
border treatment in `CapabilitiesClosingCta.vue`, `brands/Portfolio.vue` and
`network/Experience.vue`; a surface-token abstraction was unnecessary for those
three identical usages.

Use `to` for a localized internal link, `to` + `external` for a new-tab external
link, or omit `to` for a native button. Content uses the default slot and optional
`icon-start`/`icon-end` slots. Native buttons support the passed-through `disabled`
attribute; links do not implement a disabled-action contract.

Preserve hover, global `:focus-visible` rings and native disabled styling.
Sections own layout and data selection; base components receive content through
props/slots. Never use `:deep()` to restyle a base component: add an appropriate
variant or, when needed, a surface-scoped token.

For example, `app/pages/about.vue` selects `galleryFor('about')` in a computed
and passes `images` to `BaseGallery`. Its `page` prop supplies the heading ID;
an empty array renders no gallery markup. Formatting URLs/alt text is separate
from fetching or selecting CMS data.

## EN/AR typography

`app/app.vue` sets locale `lang`/`dir`. `tokens.css`, `reset.css` and `main.css`
provide an English body baseline of 1.65 and `html:lang(ar) body` uses
`--line-height-body-ar` (1.9). Use `:lang(ar)` for Arabic body-leading rules,
not writing direction as a language proxy.

The RTL font stack uses self-hosted Cairo. Heading line-height tokens are 1.2
and 1.45 for the default/RTL rules. Arabic labels have normal letter spacing
and no uppercase transformation. Preserve intentional local display-text and
admin typography overrides; the public body baseline is not every element's
computed line-height. Use logical layout properties for direction-sensitive spacing.

## Verification

The pixel-identical gate applies to changes in templates, styles, or assets,
including `<template>` and `<style>` blocks inside `.vue` files. Changes limited to
`<script>` imports or pure logic are verified by the full test suite, builds, and a
diff showing no template, style, or asset changes.

Check both `/en` and `/ar` at desktop and mobile widths. For this cleanup, visual
refactors require 124/124 identical captures with no masks or tolerance; the
approved Arabic body-leading change was the intentional visual exception.
Documentation-only changes require source-backed factual review and a docs-only
diff; no screenshot gate applies.

## Visual verification

The current capture setup lives at
`.data/baseline-review/capture-stable-design-system.mjs`; comparison lives at
`.data/baseline-review/compare-captures.mjs`, with reports under `.data/design-system/`.
The matrix is 76 page/state captures plus 48 button-state captures, across EN/AR
and 1440px desktop / 390px mobile widths.

Keep baseline and candidate on the same browser/environment and setup:

1. Emulate `reducedMotion: 'reduce'` before navigation and capture.
2. Blur incidental focus. For dedicated focus/hover checks, establish the intended
   state after that reset so focus-visible styling is still tested.
3. Wait for `document.fonts.ready` and every image to load and decode. The harness
   eagerly loads offscreen images before capture; application loading is unchanged.
4. Capture with `animations: 'disabled'` and `caret: 'hide'`.
5. Launch Chromium with `--disable-gpu` and `--disable-partial-raster`; partial
   raster produced inconsistent rounded-border pixels in the investigation.
6. Fix browser time, UTC timezone, device scale and seed revision timestamps.
   Use an isolated fixture database. Wait for carousel scrolling to settle, select
   the second then first person, and assert the first stays active through capture.

Compare decoded RGBA pixels exactly. Prove determinism with separate full runs
before adopting a baseline; the replacement Step 4 baseline passed three runs.
Do not change application behavior solely to stabilize the harness or accept
unexplained drift; investigate application regressions separately.

The scripts/artifacts are gitignored and are listed in
[known issues](known-issues.md#visual-regression-tooling-is-not-versioned).
A fresh checkout cannot reproduce these captures from tracked files alone.
**Planned, not implemented:** move the tooling and reproducible fixtures under
`tests/` after Step 8. Existing motion behavior tests still run separately;
see [motion principles](motion-principles.md).
