<script setup lang="ts">
import { networkContent as networkEn } from '~~/content/en/network'

const { t, locale } = useI18n()
const assetUrl = useAssetUrl()
const localePath = useLocalePath()

// Partner entries are index-aligned across locales (the content test
// checks their structures match), so position pairs them.
const { draft } = useAdminWorkspace()
const logos = computed(() => networkEn.partners.names.map((entry, index) => ({
  key: entry.logo?.src ?? `name-${index}`,
  nameEn: draft.value?.copy.network.find(row => row.path === `partners.names.${index}.name`)?.en ?? entry.name,
  nameAr: draft.value?.copy.network.find(row => row.path === `partners.names.${index}.name`)?.ar,
  // The draft's artwork (changed under Media), or the approved file.
  logo: entry.logo && (draft.value?.logos[entry.logo.src] ?? entry.logo),
  status: entry.status,
})))
</script>

<template>
  <section
    id="partner-logos"
    class="admin-block"
  >
    <div class="admin-block__head">
      <h2 class="text-h4 admin-block__title">
        {{ t('admin.team.logosHeading') }}
        <span class="text-small text-muted">({{ logos.length }})</span>
      </h2>
    </div>

    <ul class="logos">
      <li
        v-for="entry in logos"
        :key="entry.key"
        class="admin-panel logo-card"
      >
        <div class="logo-card__art">
          <img
            v-if="entry.logo"
            :src="assetUrl(entry.logo.src)"
            :width="entry.logo.width"
            :height="entry.logo.height"
            alt=""
            loading="lazy"
          >
        </div>
        <p
          class="text-small logo-card__name"
          dir="auto"
        >
          {{ (locale === 'ar' ? entry.nameAr : entry.nameEn) || t('admin.team.unnamed') }}
        </p>
        <AdminStatus :status="entry.status" />
        <NuxtLink
          :to="localePath('/admin/pages') + '?page=network'"
          class="admin-btn admin-btn--small"
        >{{ t('admin.common.edit') }}</NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.logos {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: var(--space-3);
}

.logo-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-3);
}

.logo-card__art {
  display: grid;
  place-items: center;
  inline-size: 100%;
  block-size: 5rem;
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  background: #f7f7f5;
}

/* Fixed caps rather than max-*: 100%: the grid row sizing this box is
   auto, so a percentage max height has nothing definite to resolve
   against and the artwork rendered at its full intrinsic size. */
.logo-card__art img {
  inline-size: auto;
  block-size: auto;
  max-inline-size: 100%;
  max-block-size: 4rem;
  object-fit: contain;
}

.logo-card__name {
  margin: 0;
  font-weight: 600;
}
</style>
