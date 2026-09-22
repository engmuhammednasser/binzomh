<script setup lang="ts">
import type { BrandImage } from '~~/types/brands'

defineProps<{ image?: BrandImage, label: string, missing: string }>()
const assetUrl = useAssetUrl()
</script>

<template>
  <figure
    v-if="image"
    class="brand-imagery"
  >
    <img
      :src="assetUrl(image.src)"
      :alt="image.alt"
      :width="image.width"
      :height="image.height"
      loading="lazy"
      decoding="async"
    >
  </figure>
  <figure
    v-else
    class="brand-imagery brand-imagery--pending"
  >
    <div
      class="brand-imagery__plane"
      aria-hidden="true"
    />
    <figcaption>
      <span class="text-label">{{ label }}</span>
      <span class="text-small">{{ missing }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.brand-imagery {
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--color-bg-alt);
}

.brand-imagery img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
}

/* A labelled composition study, not a fabricated product or brand asset. */
.brand-imagery--pending {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--space-6);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.brand-imagery__plane {
  flex: 1;
  margin: var(--space-4) var(--space-4) var(--space-7);
  background: var(--gradient-silver);
  opacity: 0.35;
  clip-path: polygon(30% 0, 100% 0, 70% 100%, 0 100%);
}

.brand-imagery figcaption {
  display: grid;
  gap: var(--space-2);
}
</style>
