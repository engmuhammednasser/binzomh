# Design tokens

All tokens live in app/assets/css/tokens.css as CSS custom properties.
Components must reference the semantic tokens (--color-text,
--color-bg-inverse, and so on), never the raw --palette-* values
directly, so a future palette change is one file.

## Palette (current working direction, not yet approved branding)

#111111, #1A1A1A, #464646, #777777, #FFFFFF, #F7F7F5, #F1F1EF, #DDDDDA,
plus a restrained silver gradient accent (--gradient-silver) echoing the
wordmarks metallic Z. See the source projects
docs/content/ASSET-AND-APPROVAL-REGISTER.md: this direction is explicitly
marked proposed, not an approved hex specification. The former
Forte-Pharma-style red palette is not used anywhere.

## Typography

Local and system font stack only; no remote font loading yet. A fluid
scale via clamp() covers Display, H1 to H4, Body Large, Body, Small, and
Label roles. Arabic does not inherit the English label letter-spacing and
uppercase treatment (see the html[dir="ltr"] versus html[dir="rtl"] rules
for .text-label in main.css), and heading and body line-height are set
separately for Arabic script, looser than the Latin values, via
--line-height-heading-ar and --line-height-body-ar.

## Logos

Only the two supplied production files are used: public/logos/
binzomah-logo-dark.png (dark artwork, for light backgrounds) and
binzomah-logo-light.png (light artwork, for dark backgrounds), copied
unmodified from the source projects docs/logos/. BaseLogo.vue renders
each at its own real aspect ratio, since they are not identical
(1252x329 versus 1254x323), and adds a small top offset to the light
variant to correct its zero top padding relative to the dark variants
roughly three percent margin, per the source asset registers documented
finding. The logos are never redrawn, recolored, or flattened; the silver
Z gradient is part of the source PNG files, not re-created in CSS.
