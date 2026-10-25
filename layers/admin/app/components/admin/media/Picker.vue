<script setup lang="ts">
import type { LibraryImage, LibraryKind } from '../../../../utils/media-library'

/**
 * Chooses an image already in the media library, in a native modal
 * <dialog> (focus trap, Escape and focus return come from the browser).
 * `kinds` limits what the target can show; `taken` lists paths that are
 * already there, offered but disabled.
 */
const props = withDefaults(defineProps<{
  open: boolean
  heading: string
  kinds: readonly LibraryKind[]
  taken?: readonly string[]
}>(), { taken: () => [] })
const emit = defineEmits<{ pick: [image: LibraryImage], close: [] }>()

const { t } = useI18n()
const assetUrl = useAssetUrl()
const { uploads, failed, library, usedIn, loadUploads } = useAdminMediaContext()

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const titleId = useId()
const filter = ref<LibraryKind | 'all'>('all')
const filters = computed(() => props.kinds.length > 1 ? ['all', ...props.kinds] as const : [])
const items = computed(() => library.value.filter(image =>
  props.kinds.includes(image.kind) && (filter.value === 'all' || image.kind === filter.value)))

watch(() => props.open, (open) => {
  if (!open) return dialog.value?.close()
  filter.value = 'all'
  dialog.value?.showModal()
  if (!uploads.value) loadUploads()
}, { flush: 'post' })

function choose(image: LibraryImage) {
  emit('pick', image)
  dialog.value?.close()
}
</script>

<template>
  <dialog
    ref="dialog"
    class="picker"
    :aria-labelledby="titleId"
    @close="emit('close')"
  >
    <div
      v-if="open"
      class="picker__inner"
    >
      <header class="picker__head">
        <h2 :id="titleId">
          {{ heading }}
        </h2>
        <button
          type="button"
          class="picker__close"
          :aria-label="t('admin.common.close')"
          @click="dialog?.close()"
        >
          ×
        </button>
      </header>

      <div
        v-if="filters.length"
        class="picker__filters"
        role="group"
        :aria-label="t('admin.media.filter')"
      >
        <button
          v-for="key in filters"
          :key="key"
          type="button"
          class="admin-btn admin-btn--small"
          :aria-pressed="filter === key"
          @click="filter = key"
        >
          {{ t(`admin.media.kinds.${key}`) }}
        </button>
      </div>

      <p
        v-if="failed"
        class="picker__note"
        role="alert"
      >
        {{ t('admin.media.loadFailed') }}
      </p>
      <ul
        v-if="items.length"
        class="picker__grid"
      >
        <li
          v-for="image in items"
          :key="image.src"
        >
          <button
            type="button"
            class="picker__item"
            :class="{ 'is-logo': image.kind === 'logo' }"
            :disabled="taken.includes(image.src)"
            @click="choose(image)"
          >
            <span class="picker__thumb">
              <img
                :src="assetUrl(image.thumb)"
                alt=""
                loading="lazy"
                decoding="async"
              >
            </span>
            <span class="picker__meta">
              <span dir="ltr">{{ image.width }} × {{ image.height }}</span>
              <span>{{ taken.includes(image.src) ? t('admin.media.alreadyHere') : t(`admin.media.kinds.${image.kind}`) }}</span>
            </span>
            <span class="visually-hidden">{{ usedIn(image.src) || t('admin.media.unused') }}</span>
          </button>
        </li>
      </ul>
      <p
        v-else-if="uploads"
        class="picker__note"
      >
        {{ t('admin.media.empty') }}
      </p>
    </div>
  </dialog>
</template>

<style scoped>
/* margin: auto restores the native centring the site-wide reset removes. */
.picker {
  inline-size: min(100% - 2rem, 60rem);
  margin: auto;
  max-block-size: calc(100svh - 2rem);
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  box-shadow: var(--admin-dialog-shadow);
}

.picker::backdrop {
  background: var(--admin-backdrop);
}

.picker__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: clamp(var(--space-4), 3vw, var(--space-5));
}

.picker__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}

.picker__head h2 {
  margin: 0;
  font-size: var(--font-size-h4);
  font-weight: 600;
}

.picker__close {
  display: grid;
  place-items: center;
  inline-size: 44px;
  block-size: 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: none;
  color: var(--color-text-muted);
  font-size: var(--font-size-h4);
  line-height: 1;
  cursor: pointer;
}

.picker__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.picker__filters [aria-pressed=true] {
  border-color: var(--admin-accent);
  background: var(--admin-accent);
  color: var(--admin-accent-ink);
}

.picker__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 9.5rem), 1fr));
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.picker__item {
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  overflow: hidden;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-alt);
  color: var(--color-text);
  font: inherit;
  text-align: start;
  cursor: pointer;
  transition: border-color var(--motion-duration-fast) var(--motion-ease);
}

.picker__item:hover:not(:disabled) {
  border-color: var(--admin-accent);
}

.picker__item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* overflow: hidden also stops a tall picture's height from stretching the 4:3 frame. */
.picker__thumb {
  display: grid;
  place-items: center;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.picker__thumb img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.is-logo .picker__thumb {
  padding: var(--space-3);
  background: var(--admin-logo-surface);
}

.is-logo .picker__thumb img {
  object-fit: contain;
}

.picker__meta {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--font-size-label);
}

.picker__meta [dir=ltr] {
  white-space: nowrap;
}

.picker__note {
  max-inline-size: none;
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
}
</style>
