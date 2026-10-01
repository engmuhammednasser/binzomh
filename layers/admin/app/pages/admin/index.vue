<script setup lang="ts">
import { aboutContent } from '~~/content/en/about'
import { networkContent } from '~~/content/en/network'
import { pendingBrandFields } from '../../../utils/brand-review'

const { draft } = useAdminWorkspace()
const brandProfiles = computed(() => draft.value?.brands ?? [])

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { t } = useI18n()
const localePath = useLocalePath()
const { newCount } = useAdminEnquiries()

useHead({ title: () => t('admin.overview.heading') })

// Prioritize the fields an editor can actually complete in the dashboard.
const pendingBrands = computed(() => brandProfiles.value
  .map(brand => ({ brand, fields: pendingBrandFields(brand).filter(field => field === 'introduction' || field === 'relationship') }))
  .filter(item => item.fields.length))
const teamCount = aboutContent.leadership.team?.length ?? 0
const logoCount = networkContent.partners.names.filter(entry => entry.logo).length
</script>

<template>
  <div>
    <p class="eyebrow">
      {{ t('admin.overview.eyebrow') }}
    </p>
    <AdminPageHeader
      :heading="t('admin.overview.heading')"
      :intro="t('admin.overview.intro')"
    >
      <template #actions>
        <NuxtLink
          :to="localePath({ path: '/admin/enquiries', query: { create: '1' } })"
          class="admin-btn"
        >
          <AdminIcon name="inbox" />
          {{ t('admin.live.addEnquiry') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/admin/pages')"
          class="admin-btn admin-btn--primary"
        >
          <AdminIcon name="pages" />
          {{ t('admin.overview.manageContent') }}
        </NuxtLink>
      </template>
    </AdminPageHeader>

    <AdminOverviewPriorities
      :new-count="newCount"
      :pending-brands="pendingBrands.length"
    />

    <div class="columns">
      <div class="columns__main">
        <AdminOverviewRecent />
        <AdminActivity />
      </div>
      <AdminOverviewReview
        :pending="pendingBrands"
        :total="brandProfiles.length"
      />
    </div>

    <AdminOverviewInventory
      :team-count="teamCount"
      :logo-count="logoCount"
    />
  </div>
</template>

<style scoped>
.eyebrow {
  margin: 0 0 0.5rem;
  color: var(--admin-accent);
  font-size: 0.8125rem;
  font-weight: 600;
}

.columns {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  align-items: start;
  gap: 1.25rem;
}

.columns__main { display: grid; gap: 1.25rem; min-inline-size: 0; }

@media (max-width: 1200px) and (min-width: 1001px), (max-width: 760px) {
  .columns {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
