<script setup lang="ts">
import type { BrandProfile } from '~~/types/brands'
import type { BrandReviewField } from '../../../../utils/brand-review'

/** Brands with fields not yet approved and usable in both languages. */
defineProps<{
  pending: { brand: BrandProfile, fields: BrandReviewField[] }[]
  total: number
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const assetUrl = useAssetUrl()
const fieldCount = 2
</script>

<template>
  <section
    class="admin-panel review"
    aria-labelledby="review-heading"
  >
    <div class="admin-section-head">
      <div>
        <h2 id="review-heading">
          {{ t('admin.overview.reviewHeading') }}
        </h2>
        <p>{{ t('admin.overview.reviewIntro') }}</p>
      </div>
      <span class="review__count">{{ pending.length }}</span>
    </div>
    <ul class="review__list">
      <li
        v-for="{ brand, fields } in pending.slice(0, 3)"
        :key="brand.slug"
      >
        <NuxtLink
          :to="localePath({ path: '/admin/brands', hash: `#brand-${brand.slug}` })"
          class="review__row"
        >
          <span class="review__brand-head">
            <span class="review__logo">
              <img
                v-if="brand.logo"
                :src="assetUrl(brand.logo.src)"
                :width="brand.logo.width"
                :height="brand.logo.height"
                alt=""
              >
              <AdminIcon
                v-else
                name="brands"
              />
            </span>
            <span
              class="review__name"
              dir="auto"
            >{{ brand.name }}</span>
            <AdminIcon name="arrow" />
          </span>
          <span class="review__fields">{{ fields.map(field => t(`admin.brands.${field}`)).join(' · ') }}</span>
          <span
            class="review__progress"
            aria-hidden="true"
          ><span :style="{ inlineSize: `${(fieldCount - fields.length) / fieldCount * 100}%` }" /></span>
          <span class="review__caption">{{ t('admin.overview.fieldsReady', { count: fieldCount - fields.length, total: fieldCount }) }}</span>
        </NuxtLink>
      </li>
    </ul>
    <p
      v-if="!pending.length"
      class="admin-empty"
    >
      <AdminIcon name="check" />{{ t('admin.overview.contentReady') }}
    </p>
    <NuxtLink
      :to="localePath('/admin/brands')"
      class="review__foot"
    >
      {{ t('admin.overview.allBrands', { count: total }) }}
      <AdminIcon name="arrow" />
    </NuxtLink>
  </section>
</template>

<style scoped>
.review__count {
  display: grid;
  place-items: center;
  min-inline-size: 28px;
  block-size: 28px;
  border-radius: 7px;
  background: var(--admin-warning-bg);
  color: var(--admin-warning);
  font-size: 0.875rem;
}

.review__list {
  list-style: none;
  margin: 0;
  padding: 0 1.25rem;
}

.review__list > li + li {
  border-block-start: 1px solid var(--color-border);
}

.review__row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.875rem 0.25rem;
  text-decoration: none;
  color: var(--color-text);
}

.review__row:hover .review__name {
  text-decoration: underline;
}

.review__brand-head {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.review__logo {
  display: grid;
  place-items: center;
  inline-size: 38px;
  block-size: 38px;
  padding: 4px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #f7f7f5;
  color: #22292e;
}

.review__logo img {
  max-inline-size: 100%;
  max-block-size: 30px;
  inline-size: auto;
  block-size: auto;
  object-fit: contain;
}

.review__name {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 600;
}

.review__brand-head > .admin-icon {
  color: var(--color-text-muted);
  inline-size: 16px;
}

.review__fields {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.review__progress {
  display: block;
  block-size: 3px;
  margin-block-start: 0.125rem;
  border-radius: 3px;
  background: var(--color-border);
  overflow: hidden;
}

.review__progress > span {
  display: block;
  block-size: 100%;
  background: var(--admin-success);
}

.review__caption {
  color: var(--admin-warning);
  font-size: 0.8125rem;
}

.review__foot {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  border-block-start: 1px solid var(--color-border);
  text-decoration: none;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.review__foot:hover {
  color: var(--color-text);
}

@media (max-width: 600px) {
  .review__foot {
    padding-inline: 1rem;
  }
}
</style>
