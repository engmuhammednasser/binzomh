<script setup lang="ts">
import type { SiteImagePage } from '~~/types/images'
import type { ReplacementError } from '../../../composables/useAdminImages'
import { ACCEPTED_IMAGE_TYPES } from '../../../../utils/image-validation'

/**
 * A page's free gallery: add any number of pictures, remove, reorder with
 * buttons (keyboard-operable, unlike drag-only sorting), and describe each
 * in both languages. The page shows none of it while the list is empty.
 */
const props = defineProps<{ page: SiteImagePage }>()

const { t } = useI18n()
const assetUrl = useAssetUrl()
const { galleries, addToGallery, removeFromGallery, moveInGallery } = useAdminImagesContext()

const items = computed(() => galleries.value[props.page])
const refused = ref<{ name: string, error: ReplacementError }[]>([])
const dragging = ref(false)

async function add(files: FileList | File[] | null | undefined) {
  if (!files?.length) return
  refused.value = await addToGallery(props.page, [...files])
}

function onPick(event: Event) {
  const input = event.target as HTMLInputElement
  add(input.files)
  input.value = ''
}

function onDrop(event: DragEvent) {
  dragging.value = false
  add(event.dataTransfer?.files)
}

// Published pictures are served from public/; ones added this session are
// local object URLs already.
const srcOf = (src: string) => src.startsWith('blob:') ? src : assetUrl(src as `/${string}`)
</script>

<template>
  <div class="gallery">
    <ol
      v-if="items.length"
      class="gallery__list"
    >
      <li
        v-for="(item, index) in items"
        :key="item.key"
        class="admin-panel item"
      >
        <div class="item__media">
          <img
            :src="srcOf(item.src)"
            :width="item.width"
            :height="item.height"
            alt=""
            loading="lazy"
          >
          <span
            v-if="false"
            class="item__badge"
          >{{ t('admin.images.newItem') }}</span>
          <span
            class="item__index"
            aria-hidden="true"
          >{{ index + 1 }}</span>
        </div>

        <div class="item__fields">
          <label class="item__field">
            <span>{{ t('admin.images.altEn') }}</span>
            <input
              v-model="item.altEn"
              class="admin-field__input"
              dir="ltr"
              lang="en"
            >
          </label>
          <label class="item__field">
            <span>{{ t('admin.images.altAr') }}</span>
            <input
              v-model="item.altAr"
              class="admin-field__input"
              dir="rtl"
              lang="ar"
            >
          </label>
          <p
            v-if="!item.altEn.trim() || !item.altAr.trim()"
            class="item__warning"
          >
            {{ t('admin.images.altMissing') }}
          </p>
        </div>

        <div class="item__actions">
          <button
            type="button"
            class="item__icon"
            :disabled="index === 0"
            :aria-label="`${t('admin.images.moveUp')} (${index + 1})`"
            @click="moveInGallery(page, item.key, -1)"
          >
            ↑
          </button>
          <button
            type="button"
            class="item__icon"
            :disabled="index === items.length - 1"
            :aria-label="`${t('admin.images.moveDown')} (${index + 1})`"
            @click="moveInGallery(page, item.key, 1)"
          >
            ↓
          </button>
          <button
            type="button"
            class="admin-btn admin-btn--small"
            @click="removeFromGallery(page, item.key)"
          >
            {{ t('admin.images.removePicture') }}
            <span class="visually-hidden">{{ index + 1 }}</span>
          </button>
        </div>
      </li>
    </ol>
    <p
      v-else
      class="gallery__empty"
    >
      {{ t('admin.images.galleryEmpty') }}
    </p>

    <label
      class="add"
      :class="{ 'is-dragging': dragging }"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="onDrop"
    >
      <input
        type="file"
        multiple
        class="add__input"
        :accept="ACCEPTED_IMAGE_TYPES.join(',')"
        aria-describedby="gallery-add-hint"
        @change="onPick"
      >
      <span class="add__plus">+</span>
      <span class="add__title">{{ t('admin.images.add') }}</span>
      <span
        id="gallery-add-hint"
        class="add__hint"
      >{{ t('admin.images.addHint') }}</span>
    </label>

    <ul
      v-if="refused.length"
      class="refused"
      role="alert"
    >
      <li
        v-for="entry in refused"
        :key="entry.name"
      >
        {{ t('admin.images.refused', { name: entry.name, reason: t(`admin.images.errors.${entry.error}`) }) }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gallery__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.gallery__empty {
  max-inline-size: none;
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.item {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.item.is-new {
  border-color: var(--admin-warning);
}

/* The same 4:3 frame the public gallery uses, so the preview is honest. */
.item__media {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--color-bg-alt);
}

.item__media img {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.item__badge,
.item__index {
  position: absolute;
  inset-block-start: 0.625rem;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.item__badge {
  inset-inline-start: 0.625rem;
  background: var(--admin-warning-bg);
  color: var(--admin-warning);
}

.item__index {
  inset-inline-end: 0.625rem;
  background: rgb(0 0 0 / 0.55);
  color: #fff;
}

.item__fields {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.875rem 1rem 0;
}

.item__field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.item__field .admin-field__input {
  padding: 0.5rem 0.625rem;
  background: var(--color-bg-alt);
  font-size: 0.8125rem;
}

.item__warning {
  max-inline-size: none;
  margin: 0;
  color: var(--admin-warning);
  font-size: 0.75rem;
}

.item__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-block-start: auto;
  padding: 0.875rem 1rem 1rem;
}

.item__icon {
  display: grid;
  place-items: center;
  inline-size: 36px;
  block-size: 36px;
  border: 1px solid var(--color-border-strong);
  border-radius: 8px;
  background: none;
  color: var(--color-text);
  font: inherit;
  cursor: pointer;
}

.item__icon:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.item__actions .admin-btn {
  margin-inline-start: auto;
}

.add {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1.5rem 1rem;
  border: 1.5px dashed var(--color-border-strong);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  text-align: center;
  cursor: pointer;
  transition:
    border-color var(--motion-duration-fast) var(--motion-ease),
    background-color var(--motion-duration-fast) var(--motion-ease);
}

.add:hover,
.add.is-dragging {
  border-color: var(--admin-accent);
  background: var(--admin-success-bg);
  color: var(--color-text);
}

.add:focus-within {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.add__input {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  opacity: 0;
}

.add__plus {
  font-size: 1.5rem;
  line-height: 1;
}

.add__title {
  color: var(--color-text);
  font-weight: 600;
}

.add__hint {
  font-size: 0.75rem;
}

.refused {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: var(--admin-error-bg);
  color: var(--admin-error-text);
  font-size: 0.8125rem;
  list-style: none;
}
</style>
