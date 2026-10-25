<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { loadUploads } = useAdminMedia()
const tabs = ['library', 'logos'] as const
const tab = computed({
  get: () => tabs.find(value => value === route.query.tab) ?? 'library',
  set: (tab) => { router.replace({ query: { ...route.query, tab } }) },
})
await loadUploads()
useHead({ title: () => t('admin.media.heading') })
</script>

<template>
  <div>
    <AdminPageHeader
      :heading="t('admin.media.heading')"
      :intro="t('admin.media.intro')"
    />
    <div
      class="media-tabs"
      role="group"
      :aria-label="t('admin.media.heading')"
    >
      <button
        v-for="key in tabs"
        :key="key"
        type="button"
        :aria-pressed="tab === key"
        @click="tab = key"
      >
        <AdminIcon :name="key === 'library' ? 'image' : 'brands'" />
        {{ t(`admin.media.tabs.${key}`) }}
      </button>
    </div>
    <AdminMediaLibrary v-if="tab === 'library'" />
    <AdminMediaLogos v-else />
  </div>
</template>

<style scoped>
.media-tabs { display: flex; gap: var(--space-5); border-block-end: 1px solid var(--color-border); margin-block-end: var(--space-5); }
.media-tabs button { display: flex; align-items: center; gap: var(--space-2); min-block-size: 44px; padding: var(--space-2) 0 var(--space-3); border-block-end: 2px solid transparent; color: var(--color-text-muted); font: inherit; font-size: var(--font-size-small); cursor: pointer; }
.media-tabs button[aria-pressed=true] { color: var(--admin-accent); border-color: var(--admin-accent); }
</style>
