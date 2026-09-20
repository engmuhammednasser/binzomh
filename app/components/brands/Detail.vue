<script setup lang="ts">
import type { BrandPresentation } from '~~/content/brands/presentation'
import type { BrandsPageContent } from '~~/types/brands'

const props = defineProps<{ brand: BrandPresentation, content: BrandsPageContent }>()
const localePath = useLocalePath()
const withBrand = (text: string) => text.replace('{brand}', props.brand.name)
</script>

<template>
  <article class="brand-detail">
    <header class="brand-detail__hero surface-inverse">
      <BaseContainer>
        <NuxtLink
          :to="localePath('/brands')"
          class="brand-detail__back"
        >{{ content.detail.back }}</NuxtLink>
        <p class="text-label">
          {{ content.detail.eyebrow }}
        </p>
        <h1 class="brand-detail__name">
          <bdi>{{ brand.name }}</bdi>
        </h1>
        <p class="text-small brand-detail__notice">
          {{ content.rosterNotice }}
        </p>
      </BaseContainer>
    </header>

    <BaseContainer class="brand-detail__body">
      <div class="brand-detail__copy">
        <section>
          <h2 class="text-h2">
            {{ content.detail.introductionHeading }}
          </h2>
          <p class="text-body-lg text-muted">
            {{ brand.introduction || content.detail.missingIntroduction }}
          </p>
        </section>
        <section>
          <h2 class="text-h3">
            {{ content.detail.relationshipHeading }}
          </h2>
          <p class="text-body-lg text-muted">
            {{ brand.relationship || content.detail.missingRelationship }}
          </p>
        </section>
        <section
          v-if="brand.ranges.length"
          class="brand-detail__ranges"
        >
          <h2 class="text-h3">
            {{ content.detail.rangesHeading }}
          </h2>
          <ul>
            <li
              v-for="range in brand.ranges"
              :key="range.name"
            >
              <h3 class="text-h4">
                {{ range.name }}
              </h3>
              <p
                v-if="range.description"
                class="text-muted"
              >
                {{ range.description }}
              </p>
            </li>
          </ul>
        </section>
      </div>
      <BrandsImagery
        :image="brand.image"
        :label="content.detail.imageLabel"
        :missing="content.detail.missingImage"
      />
    </BaseContainer>

    <section class="brand-detail__enquiry surface-alt">
      <BaseContainer content>
        <h2 class="text-h2">
          {{ withBrand(content.detail.enquiryHeading) }}
        </h2>
        <p class="text-body-lg text-muted">
          {{ content.detail.enquiryBody }}
        </p>
        <BaseButton to="/contact">
          {{ withBrand(content.detail.enquiryLabel) }}
        </BaseButton>
      </BaseContainer>
    </section>
  </article>
</template>

<style scoped>
.brand-detail__hero {
  padding-block: var(--space-7) var(--space-section);
}

.brand-detail__back {
  display: inline-flex;
  align-items: center;
  min-block-size: 44px;
  margin-block-end: var(--space-8);
}

.brand-detail__hero .text-label,
.brand-detail__notice {
  color: var(--color-text-on-dark-muted);
}

.brand-detail__name {
  font-size: clamp(2.75rem, 9vw, 8rem);
  font-weight: 500;
  overflow-wrap: anywhere;
  margin-block: var(--space-4) var(--space-7);
}

.brand-detail__body {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  align-items: start;
  gap: var(--space-9);
  padding-block: var(--space-section);
}

.brand-detail__copy {
  display: grid;
  gap: var(--space-8);
}

.brand-detail__copy p {
  margin-block-start: var(--space-4);
}

.brand-detail__ranges ul {
  list-style: none;
  padding: 0;
  margin-block-start: var(--space-5);
}

.brand-detail__ranges li {
  padding-block: var(--space-5);
  border-block-start: 1px solid var(--color-border);
}

.brand-detail__enquiry {
  padding-block: var(--space-8);
}

.brand-detail__enquiry p {
  margin-block: var(--space-4) var(--space-6);
}

@media (max-width: 767px) {
  .brand-detail__body {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-7);
  }

  .brand-detail__body :deep(.brand-imagery) {
    inline-size: 100%;
    max-inline-size: 26rem;
  }
}
</style>
