<script setup lang="ts">
import type { HomeBrandsContent, BrandContent } from '~~/types/content'

defineProps<{ content: HomeBrandsContent, brands: BrandContent[] }>()

const localePath = useLocalePath()
const assetUrl = useAssetUrl()
</script>

<template>
  <section class="brands surface-alt">
    <BaseContainer class="stack-section">
      <MotionReveal class="brands__head">
        <p class="text-label text-muted">
          {{ content.eyebrow }}
        </p>
        <h2 class="text-h1 brands__heading">
          {{ content.heading }}
        </h2>
        <p class="text-body-lg text-muted brands__intro">
          {{ content.intro }}
        </p>
      </MotionReveal>

      <ul class="brands__list">
        <li
          v-for="(brand, index) in brands"
          :key="brand.slug"
          class="brands__row"
        >
          <MotionReveal :delay="index * 90">
            <NuxtLink
              :to="localePath(`/brands/${brand.slug}`)"
              class="brands__link"
            >
              <img
                v-if="brand.logo"
                :src="assetUrl(brand.logo.src)"
                :width="brand.logo.width"
                :height="brand.logo.height"
                :alt="brand.name"
                class="brands__logo-img"
                decoding="async"
                loading="lazy"
              >
              <span
                v-else
                class="brands__name-fallback"
              >{{ brand.name }}</span>
            </NuxtLink>
          </MotionReveal>
        </li>
      </ul>

      <MotionReveal :delay="brands.length * 90">
        <p class="text-small text-muted brands__disclaimer">
          {{ content.disclaimer }}
        </p>
        <BaseButton
          v-if="content.cta"
          :to="content.cta.to"
          variant="secondary"
        >
          {{ content.cta.label }}
        </BaseButton>
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.brands__head {
  margin-block-end: var(--space-8);
}

.brands__heading {
  margin-block: var(--space-4);
}

.brands__intro {
  max-inline-size: 34rem;
}

.brands__list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

.brands__row {
  min-inline-size: 0;
}

/* Brand logo files (public/logos/brands/) carry their own flattened,
   opaque background per source deck and differ wildly in aspect ratio
   (630x630 to 1365x667) — a card with object-fit: contain normalizes both
   instead of stretching or cropping the artwork, and gives the artwork
   more room to read clearly than a text-row layout would. The three cards
   share one grid row and stretch to fill the container width evenly. See
   docs/unresolved-content-approvals.md item 1 for the scoped approval. */
.brands__link {
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
  block-size: 12rem;
  padding: var(--space-6);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--motion-duration-base) var(--motion-ease), box-shadow var(--motion-duration-base) var(--motion-ease);
}

.brands__link:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-sm);
}

.brands__logo-img {
  max-inline-size: 100%;
  max-block-size: 100%;
  object-fit: contain;
}

/* Fallback for a future roster entry that ships before its own logo
   clears approval — see the optional BrandLogo field in types/brands.ts. */
.brands__name-fallback {
  font-size: var(--font-size-h4);
  font-weight: 600;
  color: var(--color-text);
  text-align: center;
}

.brands__disclaimer {
  margin-block: var(--space-6) var(--space-4);
  max-inline-size: 34rem;
}

@media (max-width: 640px) {
  .brands__list {
    gap: var(--space-3);
  }

  .brands__link {
    block-size: 6rem;
    padding: var(--space-3);
  }
}
</style>
