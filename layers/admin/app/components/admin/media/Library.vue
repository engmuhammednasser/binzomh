<script setup lang="ts">
import type { ReplacementError } from '../../../composables/useAdminImages'
import { ACCEPTED_IMAGE_TYPES } from '../../../../utils/image-validation'
import { LIBRARY_KINDS, type LibraryKind } from '../../../../utils/media-library'

/**
 * Every image the site can use, with where the draft uses it. Uploading
 * here only stores the file; choosing it for a page, a gallery or a logo
 * is what puts it in the draft.
 */
const { t, locale } = useI18n()
const assetUrl = useAssetUrl()
const { library, usedIn, failed, addToLibrary } = useAdminMediaContext()

const filter = ref<LibraryKind | 'all'>('all')
const filters = ['all', ...LIBRARY_KINDS] as const
const items = computed(() => library.value.filter(image => filter.value === 'all' || image.kind === filter.value))
const count = (key: LibraryKind | 'all') => key === 'all' ? library.value.length : library.value.filter(image => image.kind === key).length
const refused = ref<{ name: string, error: ReplacementError }[]>([])
const dragging = ref(false)
const busy = ref(false)

async function add(files: FileList | null | undefined) {
  if (!files?.length || busy.value) return
  busy.value = true
  refused.value = await addToLibrary([...files])
  busy.value = false
  filter.value = 'all'
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

const size = (bytes: number) => new Intl.NumberFormat(locale.value === 'ar' ? 'ar-SA-u-nu-latn' : 'en-GB', { style: 'unit', unit: bytes < 1024 * 1024 ? 'kilobyte' : 'megabyte', maximumFractionDigits: 1 })
  .format(bytes < 1024 * 1024 ? bytes / 1024 : bytes / 1024 / 1024)
</script>

<template>
  <section
    class="library"
    aria-labelledby="library-heading"
  >
    <div class="admin-block__head">
      <div>
        <h2
          id="library-heading"
          class="library__heading"
        >
          {{ t('admin.media.tabs.library') }}
        </h2>
        <p class="library__hint">
          {{ t('admin.media.libraryHint') }}
        </p>
      </div>
    </div>

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
        :disabled="busy"
        :accept="ACCEPTED_IMAGE_TYPES.join(',')"
        aria-describedby="library-add-hint"
        @change="onPick"
      >
      <span class="add__plus">+</span>
      <span class="add__title">{{ t('admin.media.upload') }}</span>
      <span
        id="library-add-hint"
        class="add__hint"
      >{{ t('admin.media.uploadHint') }}</span>
      <span
        v-if="busy"
        class="add__hint"
        role="status"
      >…</span>
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
    <p
      v-if="failed"
      class="refused"
      role="alert"
    >
      {{ t('admin.media.loadFailed') }}
    </p>

    <div
      class="library__filters"
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
        {{ t(`admin.media.kinds.${key}`) }}<span class="library__count">{{ count(key) }}</span>
      </button>
    </div>

    <ul
      v-if="items.length"
      class="library__grid"
    >
      <li
        v-for="image in items"
        :key="image.src"
        class="admin-panel card"
      >
        <div
          class="card__media"
          :class="{ 'is-logo': image.kind === 'logo' }"
        >
          <img
            :src="assetUrl(image.thumb)"
            alt=""
            loading="lazy"
            decoding="async"
          >
        </div>
        <dl class="card__meta">
          <div>
            <dt>{{ t('admin.images.size') }}</dt>
            <dd dir="ltr">
              {{ image.width }} × {{ image.height }}
            </dd>
          </div>
          <div>
            <dt>{{ t('admin.media.kind') }}</dt>
            <dd>
              {{ t(`admin.media.kinds.${image.kind}`) }}<template v-if="image.bytes">
                · {{ size(image.bytes) }}
              </template>
            </dd>
          </div>
          <div class="card__wide">
            <dt>{{ t('admin.media.usedIn') }}</dt>
            <dd :class="{ 'is-unused': !usedIn(image.src) }">
              {{ usedIn(image.src) || t('admin.media.unused') }}
            </dd>
          </div>
        </dl>
      </li>
    </ul>
    <p
      v-else
      class="library__hint"
    >
      {{ t('admin.media.empty') }}
    </p>
  </section>
</template>

<style scoped>
.library {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.library__heading {
  margin: 0;
  font-size: var(--font-size-h4);
}

.library__hint {
  max-inline-size: none;
  margin: var(--space-1) 0 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-label);
}

.library__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.library__filters [aria-pressed=true] {
  border-color: var(--admin-accent);
  background: var(--admin-accent);
  color: var(--admin-accent-ink);
}

.library__count {
  margin-inline-start: var(--space-2);
  font-variant-numeric: tabular-nums;
  opacity: 0.8;
}

.library__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 13rem), 1fr));
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* overflow: hidden also stops a tall picture's height from stretching the 4:3 frame. */
.card__media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--color-bg-alt);
}

.card__media img {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.card__media.is-logo {
  padding: var(--space-4);
  background: var(--admin-logo-surface);
}

.card__media.is-logo img {
  object-fit: contain;
}

.card__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2) var(--space-4);
  margin: 0;
  padding: var(--space-3) var(--space-4) var(--space-4);
}

.card__wide {
  grid-column: 1 / -1;
}

.card__meta dt {
  color: var(--color-text-muted);
  font-size: var(--font-size-label);
}

.card__meta dd {
  margin: 0;
  font-size: var(--font-size-label);
  font-variant-numeric: tabular-nums;
}

.card__meta dd.is-unused {
  color: var(--color-text-muted);
}

.add {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-5) var(--space-4);
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
  font-size: var(--font-size-h4);
  line-height: 1;
}

.add__title {
  color: var(--color-text);
  font-weight: 600;
}

.add__hint {
  font-size: var(--font-size-label);
}

.refused {
  max-inline-size: none;
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  background: var(--admin-error-bg);
  color: var(--admin-error-text);
  font-size: var(--font-size-label);
  list-style: none;
}
</style>
