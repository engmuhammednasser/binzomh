<script setup lang="ts">
import type { BrandProfile, BrandsPageContent } from '~~/types/brands'

defineProps<{ brands: BrandProfile[], content: BrandsPageContent }>()
const localePath = useLocalePath()
</script>

<template>
  <div class="brand-portfolio">
    <header class="portfolio-hero surface-inverse">
      <BaseContainer>
        <p class="text-label">
          {{ content.eyebrow }}
        </p>
        <h1 class="text-display">
          {{ content.title }}
        </h1>
        <p class="text-h3 portfolio-hero__intro">
          {{ content.intro }}
        </p>
      </BaseContainer>
    </header>

    <BaseContainer class="portfolio-roster">
      <p class="text-small text-muted portfolio-roster__notice">
        {{ content.rosterNotice }}
      </p>
      <ol class="portfolio-roster__list">
        <li
          v-for="(brand, index) in brands"
          :key="brand.slug"
        >
          <NuxtLink
            :to="localePath(`/brands/${brand.slug}`)"
            :aria-label="`${content.viewBrand} ${brand.name}`"
            class="portfolio-roster__link"
          >
            <span
              class="text-label text-muted"
              aria-hidden="true"
            >{{ String(index + 1).padStart(2, '0') }}</span>
            <h2 class="portfolio-roster__name"><bdi>{{ brand.name }}</bdi></h2>
            <span class="portfolio-roster__action text-small">
              {{ content.viewBrand }}
              <span
                class="portfolio-roster__arrow"
                aria-hidden="true"
              >↗</span>
            </span>
          </NuxtLink>
        </li>
      </ol>
    </BaseContainer>

    <section class="portfolio-enquiry surface-alt">
      <BaseContainer class="portfolio-enquiry__inner">
        <div>
          <h2 class="text-h2">
            {{ content.enquiryHeading }}
          </h2>
          <p class="text-body-lg text-muted">
            {{ content.enquiryBody }}
          </p>
        </div>
        <BaseButton :to="content.enquiryCta.to">
          {{ content.enquiryCta.label }}
        </BaseButton>
      </BaseContainer>
    </section>
  </div>
</template>

<style scoped>
.portfolio-hero {
  padding-block: var(--space-section);
  border-block-end: 3px solid var(--color-border-strong);
}

.portfolio-hero .text-label {
  color: var(--color-text-on-dark-muted);
}

.portfolio-hero h1 {
  margin-block: var(--space-5) var(--space-7);
}

.portfolio-hero__intro {
  max-inline-size: 27ch;
  color: var(--color-text-on-dark-muted);
}

.portfolio-roster {
  padding-block: var(--space-8) var(--space-section);
}

.portfolio-roster__notice {
  margin-block-end: var(--space-7);
}

.portfolio-roster__list {
  list-style: none;
  padding: 0;
  border-block-start: 1px solid var(--color-border);
}

.portfolio-roster__link {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) auto;
  align-items: baseline;
  gap: var(--space-5);
  padding-block: clamp(var(--space-6), 5vw, var(--space-9));
  border-block-end: 1px solid var(--color-border);
  text-decoration: none;
}

.portfolio-roster__name {
  font-size: clamp(2rem, 5.5vw, 4.75rem);
  font-weight: 500;
  overflow-wrap: anywhere;
}

.portfolio-roster__action {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.portfolio-roster__arrow {
  font-size: 1.5rem;
}

html[dir='rtl'] .portfolio-roster__arrow {
  transform: scaleX(-1);
}

.portfolio-roster__link:hover .portfolio-roster__action,
.portfolio-roster__link:focus-visible .portfolio-roster__action {
  text-decoration: underline;
}

.portfolio-enquiry {
  padding-block: var(--space-8);
}

.portfolio-enquiry__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
}

.portfolio-enquiry p {
  margin-block-start: var(--space-4);
}

.portfolio-enquiry .base-button {
  flex-shrink: 0;
}

@media (max-width: 639px) {
  .portfolio-roster__link {
    grid-template-columns: 1.5rem minmax(0, 1fr);
    gap: var(--space-3);
  }

  .portfolio-roster__action {
    grid-column: 2;
  }

  .portfolio-enquiry__inner {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
