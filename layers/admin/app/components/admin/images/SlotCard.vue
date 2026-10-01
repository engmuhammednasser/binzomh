<script setup lang="ts">
import type { SiteImageSlot } from '~~/types/images'
import { frameAspect, SITE_IMAGE_FORMATS } from '~~/shared/utils/site-image'
import { usageKey } from '../../../composables/useAdminImages'
import { describeRatio } from '../../../../utils/image-validation'

/**
 * One fixed image place on a page. Shows what the page will show after
 * this session's edit: the replacement, the design placeholder if the
 * image was removed, or the published file.
 */
const props = defineProps<{ entry: SiteImageSlot }>()
const emit = defineEmits<{ replace: [entry: SiteImageSlot] }>()

const { t } = useI18n()
const assetUrl = useAssetUrl()
const { slotEdits, removeSlot, resetSlot } = useAdminImagesContext()

const edit = computed(() => slotEdits.value.get(props.entry.id))
const shownSrc = computed(() => {
  if (edit.value?.kind === 'replace') return edit.value.image.url
  if (edit.value?.kind === 'remove') return null
  return props.entry.image ? assetUrl(props.entry.image.src) : null
})
const hasImage = computed(() => Boolean(shownSrc.value))
const title = computed(() => t(usageKey(props.entry.section)))
// What the page serves, in the order it offers it: WebP, AVIF, then the
// original — and the widths, derivatives first, the full-size copy last.
const formats = computed(() => {
  const image = props.entry.image
  if (!image) return ''
  const encodings = SITE_IMAGE_FORMATS.filter(f => image.formats.includes(f) || image.variants?.formats.includes(f))
  if (!encodings.length) return t('admin.images.originalOnly')
  const original = image.src.split('.').pop()?.toUpperCase() ?? ''
  const widths = [
    ...(image.variants?.widths.filter(width => width < image.width) ?? []),
    ...(image.formats.length ? [image.width] : []),
  ]
  return `${[...encodings.map(f => f.toUpperCase()), original].join(' / ')} · ${widths.join(', ')}w`
})
</script>

<template>
  <article
    class="admin-panel card"
    :class="{ 'is-edited': edit }"
  >
    <!-- The thumbnail keeps the slot's own frame, so a portrait slot reads
         as a portrait and a replacement shows how it will be framed. -->
    <div
      class="card__media"
      :style="{ aspectRatio: frameAspect(entry.frame) }"
    >
      <img
        v-if="shownSrc"
        :src="shownSrc"
        :width="entry.frame.width"
        :height="entry.frame.height"
        alt=""
        loading="lazy"
        decoding="async"
      >
      <HomeEditorialVisual
        v-else
        treatment="photography"
        :aspect="frameAspect(entry.frame)"
        :caption="t('admin.images.placeholder')"
      />
      <span
        v-if="edit"
        class="card__badge"
      >{{ edit.kind === 'remove' ? t('admin.images.removed') : t('admin.images.pending') }}</span>
    </div>

    <div class="card__body">
      <h4 class="card__title">
        {{ title }}
      </h4>

      <dl class="card__meta">
        <div>
          <dt>{{ t('admin.images.size') }}</dt>
          <dd dir="ltr">
            {{ entry.frame.width }} × {{ entry.frame.height }}
          </dd>
        </div>
        <div>
          <dt>{{ t('admin.images.ratio') }}</dt>
          <dd dir="ltr">
            {{ describeRatio(entry.frame.width, entry.frame.height) }}
          </dd>
        </div>
        <div
          v-if="entry.image"
          class="card__meta-wide"
        >
          <dt>{{ t('admin.images.formats') }}</dt>
          <dd dir="ltr">
            {{ formats }}
          </dd>
        </div>
      </dl>

      <div class="card__actions">
        <button
          type="button"
          class="admin-btn admin-btn--small"
          @click="emit('replace', entry)"
        >
          <AdminIcon name="image" />
          {{ t('admin.images.replace') }}
          <span class="visually-hidden">{{ title }}</span>
        </button>
        <button
          v-if="hasImage"
          type="button"
          class="admin-btn admin-btn--small"
          @click="removeSlot(entry)"
        >
          {{ t('admin.images.remove') }}
          <span class="visually-hidden">{{ title }}</span>
        </button>
        <button
          v-if="edit"
          type="button"
          class="admin-btn admin-btn--small"
          @click="resetSlot(entry.id)"
        >
          {{ t('admin.images.restore') }}
          <span class="visually-hidden">{{ title }}</span>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card.is-edited {
  border-color: var(--admin-warning);
}

.card__media {
  position: relative;
  max-block-size: 15rem;
  inline-size: 100%;
  background: var(--color-bg-alt);
  overflow: hidden;
}

.card__media img {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.card__media :deep(.editorial-visual) {
  block-size: 100%;
  border-radius: 0;
}

.card__badge {
  position: absolute;
  inset-block-start: 0.75rem;
  inset-inline-start: 0.75rem;
  max-inline-size: calc(100% - 1.5rem);
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  background: var(--admin-warning-bg);
  color: var(--admin-warning);
  font-size: 0.75rem;
  font-weight: 600;
}

.card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1rem 1.125rem 1.125rem;
}

.card__title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
}

.card__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem 1rem;
  margin: 0;
}

.card__meta-wide {
  grid-column: 1 / -1;
}

.card__meta dt {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.card__meta dd {
  margin: 0;
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  text-align: start;
}

.card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block-start: auto;
}
</style>
