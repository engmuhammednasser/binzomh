<script setup lang="ts">
/**
 * Shared abstract placeholder for every "visual area" on the homepage
 * (Hero, About, Capabilities). No photography is approved yet (see
 * docs/unresolved-content-approvals.md item 3) — rather than a broken-image
 * box or a stock photo mislabeled as a Binzomah facility, this is an
 * intentional, honestly-abstract panel: a dark field with a restrained
 * silver diagonal band (the wordmark's "Z" ribbon as inspiration only, not
 * a literal graphic — see docs/motion-principles.md).
 *
 * `variant` rotates the band's angle/position so, e.g., Capabilities'
 * three states read as related but distinct. `caption` is optional small
 * print (e.g. a capability title) for extra context; the panel itself is
 * decorative and hidden from assistive tech either way, since the caption
 * text already exists in real, visible DOM content next to it.
 */
withDefaults(
  defineProps<{
    variant?: number
    caption?: string
    aspect?: string
  }>(),
  { variant: 0, caption: undefined, aspect: '4 / 5' },
)
</script>

<template>
  <div
    class="editorial-visual"
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
  background: var(--color-bg-inverse);
  border-radius: var(--radius-md);
}

.editorial-visual::before {
  content: '';
  position: absolute;
  inset-block-start: -30%;
  inset-inline-start: -10%;
  inline-size: 75%;
  block-size: 160%;
  background: var(--gradient-silver);
  opacity: 0.16;
  transform: rotate(-18deg);
}

.editorial-visual[data-variant='1']::before {
  inset-inline-start: 10%;
  transform: rotate(-9deg);
}

.editorial-visual[data-variant='2']::before {
  inset-inline-start: -25%;
  transform: rotate(-27deg);
}

.editorial-visual__caption {
  position: absolute;
  inset-block-end: var(--space-4);
  inset-inline-start: var(--space-4);
  color: var(--color-text-on-dark-muted);
}
</style>
