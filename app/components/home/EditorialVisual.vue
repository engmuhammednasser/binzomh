<script setup lang="ts">
/**
 * Shared abstract placeholder for the homepage's "visual area" sections.
 * No photography is approved yet (see docs/unresolved-content-approvals.md
 * item 3) — rather than a broken-image box or a stock photo mislabeled as a
 * Binzomah facility, this renders one of two intentional, honestly-abstract
 * treatments:
 *
 * - "geometric" (default): a dark field with layered, asymmetric silver
 *   diagonals (the wordmark's "Z" ribbon as inspiration only, never a
 *   literal graphic — see docs/motion-principles.md) and an editorial
 *   die-cut corner. Used where the brand's own geometry is the point
 *   (Hero, Capabilities).
 * - "photography": a light neutral field with crop-mark corner brackets —
 *   the visual language of "a photograph will be placed here", used where
 *   the eventual asset is real corporate photography rather than brand
 *   geometry (the homepage's About teaser). Deliberately does not reuse
 *   the dark/diagonal language, so the two sections read as distinct.
 *
 * `variant` rotates the geometric treatment's angle/position so, e.g.,
 * Capabilities' three states read as related but distinct. `caption` is
 * optional small print for extra context; the panel itself is decorative
 * and hidden from assistive tech either way, since the caption text
 * already exists in real, visible DOM content next to it.
 */
withDefaults(
  defineProps<{
    variant?: number
    caption?: string
    aspect?: string
    treatment?: 'geometric' | 'photography'
  }>(),
  { variant: 0, caption: undefined, aspect: '4 / 5', treatment: 'geometric' },
)
</script>

<template>
  <div
    class="editorial-visual"
    :class="`editorial-visual--${treatment}`"
    :data-variant="variant % 3"
    :style="{ aspectRatio: aspect }"
    aria-hidden="true"
  >
    <span
      v-if="caption"
      class="editorial-visual__caption text-label"
    >{{ caption }}</span>
  </div>
</template>

<style scoped>
.editorial-visual {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border-radius: var(--radius-md);
}

/* ---------------------------------------------------------------------
   Geometric treatment — dark field, layered diagonals, die-cut corner.
--------------------------------------------------------------------- */
.editorial-visual--geometric {
  background:
    linear-gradient(155deg, rgb(255 255 255 / 0.05), transparent 55%),
    var(--color-bg-inverse);
  /* An asymmetric editorial crop — one corner cut on the diagonal, mirrored
     under RTL so it stays an inline-end detail either way. */
  clip-path: polygon(0 0, calc(100% - 2.25rem) 0, 100% 2.25rem, 100% 100%, 0 100%);
}

html[dir="rtl"] .editorial-visual--geometric {
  clip-path: polygon(2.25rem 0, 100% 0, 100% 100%, 0 100%, 0 2.25rem);
}

.editorial-visual--geometric::before {
  content: '';
  position: absolute;
  inset-block-start: -35%;
  inset-inline-start: -15%;
  inline-size: 80%;
  block-size: 170%;
  background: var(--gradient-silver);
  opacity: 0.22;
  transform: rotate(-20deg);
}

.editorial-visual--geometric::after {
  /* A second, thinner, brighter line for depth/layering — offset from the
     main band rather than parallel to it. */
  content: '';
  position: absolute;
  inset-block-start: 8%;
  inset-inline-end: 12%;
  inline-size: 3px;
  block-size: 130%;
  background: var(--gradient-silver);
  opacity: 0.55;
  transform: rotate(-20deg);
}

.editorial-visual--geometric[data-variant='1']::before {
  inset-inline-start: 20%;
  transform: rotate(-10deg);
}

.editorial-visual--geometric[data-variant='1']::after {
  inset-inline-end: 22%;
  transform: rotate(-10deg);
}

.editorial-visual--geometric[data-variant='2']::before {
  inset-inline-start: -30%;
  transform: rotate(-30deg);
}

.editorial-visual--geometric[data-variant='2']::after {
  inset-inline-end: 6%;
  transform: rotate(-30deg);
}

.editorial-visual--geometric .editorial-visual__caption {
  color: var(--color-text-on-dark-muted);
}

/* ---------------------------------------------------------------------
   Photography treatment — light field, crop-mark corners, no geometry.
--------------------------------------------------------------------- */
.editorial-visual--photography {
  background: var(--color-bg-raised);
}

.editorial-visual--photography::before,
.editorial-visual--photography::after {
  content: '';
  position: absolute;
  inline-size: 2rem;
  block-size: 2rem;
}

.editorial-visual--photography::before {
  inset-block-start: var(--space-4);
  inset-inline-start: var(--space-4);
  border-block-start: 2px solid var(--color-border-strong);
  border-inline-start: 2px solid var(--color-border-strong);
}

.editorial-visual--photography::after {
  inset-block-end: var(--space-4);
  inset-inline-end: var(--space-4);
  border-block-end: 2px solid var(--color-border-strong);
  border-inline-end: 2px solid var(--color-border-strong);
}

.editorial-visual--photography .editorial-visual__caption {
  color: var(--color-text-muted);
}

/* ---------------------------------------------------------------------
   Shared
--------------------------------------------------------------------- */
.editorial-visual__caption {
  position: absolute;
  inset-block-end: var(--space-4);
  inset-inline-start: var(--space-4);
}
</style>
