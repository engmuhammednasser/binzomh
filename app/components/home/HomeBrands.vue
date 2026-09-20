<script setup lang="ts">
import type { HomeBrandsContent, BrandContent } from '~~/types/content'

defineProps<{ content: HomeBrandsContent, brands: BrandContent[] }>()

const localePath = useLocalePath()
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
              <span class="brands__index">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="brands__name">{{ brand.name }}</span>
              <span class="text-small text-muted brands__meta">{{ $t('brand.view') }}</span>
              <span
                class="brands__arrow"
                aria-hidden="true"
              />
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
          variant="text"
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
  border-block-start: 1px solid var(--color-border);
}

.brands__row {
  border-block-end: 1px solid var(--color-border);
}

.brands__link {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding-block: var(--space-7);
  padding-inline: var(--space-3);
  margin-inline: calc(-1 * var(--space-3));
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: background-color var(--motion-duration-base) var(--motion-ease);
}

.brands__link:hover {
  background: var(--color-bg);
}

.brands__link:hover .brands__name {
  color: var(--color-text-muted);
}

.brands__index {
  flex: 0 0 auto;
  inline-size: 2.5rem;
  font-size: var(--font-size-h4);
  font-weight: 600;
  color: var(--color-text-subtle);
}

.brands__name {
  flex: 1 1 auto;
  /* A lower floor than --font-size-h1: brand names are single unbreakable
     words (e.g. "Embryolisse") in a flex row with fixed-width siblings —
     the shared h1 clamp's minimum was still wide enough to overflow a
     320px viewport. */
  font-size: clamp(1.375rem, 1rem + 4.5vw, var(--font-size-h1));
  font-weight: 600;
  line-height: 1.15;
  min-inline-size: 0;
  overflow-wrap: anywhere;
  transition: color var(--motion-duration-fast) var(--motion-ease);
}

.brands__meta {
  flex: 0 0 auto;
}

.brands__arrow {
  flex: 0 0 auto;
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-block-start: 2px solid var(--color-text);
  border-inline-end: 2px solid var(--color-text);
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity var(--motion-duration-base) var(--motion-ease);
}

.brands__link:hover .brands__arrow {
  opacity: 1;
}

.brands__disclaimer {
  margin-block: var(--space-6) var(--space-4);
  max-inline-size: 34rem;
}

/* The Arabic "عرض العلامة التجارية" meta label is long enough, alongside
   the index column, to squeeze the name column at 320-390px. The whole
   row is already a link, so the label is a nice-to-have, not essential —
   drop it rather than crowd the brand name. */
@media (max-width: 480px) {
  .brands__meta,
  .brands__arrow {
    display: none;
  }
}
</style>
