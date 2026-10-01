<script setup lang="ts">
import type { SiteImageSlot } from '~~/types/images'
import { ADMIN_PAGE_KEYS } from '../../composables/useAdminPageContent'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { page, rows, pageChanged } = useAdminPageContent()
const { slotsFor, changesFor, galleries } = useAdminImages()
const tabs = ['text', 'images', 'gallery'] as const
const tab = computed({
  get: () => tabs.find(value => value === route.query.tab) ?? 'text',
  set: (tab) => { router.replace({ query: { ...route.query, tab } }) },
})
const slots = computed(() => slotsFor(page.value))
const replacing = ref<SiteImageSlot | null>(null)
const counts = computed(() => ({ text: rows.value.length, images: slots.value.length, gallery: galleries.value[page.value].length }))
useHead({ title: () => t('admin.pages.heading') })
</script>

<template>
  <div>
    <AdminPageHeader
      :heading="t('admin.pages.heading')"
      :intro="t('admin.pages.intro')"
    />
    <div
      class="page-picker"
      role="group"
      :aria-label="t('admin.pages.page')"
    >
      <button
        v-for="key in ADMIN_PAGE_KEYS"
        :key="key"
        type="button"
        class="page-btn"
        :aria-pressed="page === key"
        @click="page = key"
      >
        {{ t(`admin.pages.${key}`) }}
        <span
          v-if="pageChanged(key) || changesFor(key)"
          class="admin-change-dot"
        ><span class="visually-hidden">{{ t('admin.live.unsaved') }}</span></span>
      </button>
    </div>
    <div
      class="editor-tabs"
      role="group"
      :aria-label="t('admin.editor.contentType')"
    >
      <button
        v-for="key in tabs"
        :key="key"
        :aria-pressed="tab === key"
        @click="tab = key"
      >
        <AdminIcon :name="key === 'text' ? 'pages' : 'image'" />
        {{ t(`admin.editor.${key}`) }}<span>{{ counts[key] }}</span>
      </button>
    </div>
    <AdminCopyEditor v-if="tab === 'text'" />
    <section
      v-else-if="tab === 'images'"
      aria-labelledby="page-slots"
    >
      <div class="admin-block__head">
        <div>
          <h2
            id="page-slots"
            class="editor-heading"
          >
            {{ t('admin.images.slotsHeading') }}
          </h2>
          <p class="section-hint">
            {{ t('admin.images.slotsHint') }}
          </p>
        </div>
      </div>
      <div
        v-if="slots.length"
        class="slots"
      >
        <AdminImagesSlotCard
          v-for="entry in slots"
          :key="entry.id"
          :entry="entry"
          @replace="replacing = $event"
        />
      </div>
      <p
        v-else
        class="admin-empty admin-panel"
      >
        {{ t('admin.images.noSlots') }}
      </p>
    </section>
    <section
      v-else
      aria-labelledby="page-gallery"
    >
      <div class="admin-block__head">
        <div>
          <h2
            id="page-gallery"
            class="editor-heading"
          >
            {{ t('admin.images.galleryHeading') }}
          </h2>
          <p class="section-hint">
            {{ t('admin.images.galleryHint') }}
          </p>
        </div>
      </div>
      <AdminImagesGallery
        :key="page"
        :page="page"
      />
    </section>
    <AdminImagesReplacer
      :entry="replacing"
      @close="replacing = null"
    />
  </div>
</template>

<style scoped>
.page-picker { display: flex; flex-wrap: wrap; gap: .5rem; margin-block-end: 1.5rem; }
.page-btn { position: relative; display: inline-flex; align-items: center; gap: .5rem; min-block-size: 44px; padding: .5rem 1rem; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-bg); color: var(--color-text-muted); font: inherit; font-size: .875rem; cursor: pointer; }
.page-btn[aria-pressed=true] { background: var(--admin-accent); border-color: var(--admin-accent); color: var(--admin-accent-ink); font-weight: 700; }
.page-btn[aria-pressed=true] .admin-change-dot { background: #744e13; }
.editor-tabs { display: flex; gap: 1.5rem; border-block-end: 1px solid var(--color-border); margin-block-end: 1.5rem; }
.editor-tabs button { display: flex; align-items: center; gap: .5rem; padding: .6rem 0 .9rem; min-block-size: 44px; border-block-end: 2px solid transparent; color: var(--color-text-muted); font: inherit; font-size: .875rem; cursor: pointer; }
.editor-tabs button[aria-pressed=true] { color: var(--admin-accent); border-color: var(--admin-accent); }
.editor-tabs button > span { border-radius: 5px; background: var(--color-bg-raised); padding: 0 .35rem; font-size: .75rem; }
.editor-heading { margin: 0; font-size: 1.1rem; }
.section-hint { margin: .25rem 0 0; color: var(--color-text-muted); font-size: .8125rem; }
.slots { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr)); gap: 1rem; }
@media (max-width: 600px) { .page-picker { flex-wrap: nowrap; overflow-x: auto; padding-block: .3rem; } .page-btn { flex-shrink: 0; } .editor-tabs { gap: 1rem; } .editor-tabs .admin-icon { display: none; } }
</style>
