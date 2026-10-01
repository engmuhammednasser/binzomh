<script setup lang="ts">
import type { SiteImageSlot } from '~~/types/images'
import { frameAspect } from '~~/shared/utils/site-image'
import type { ReplacementError } from '../../../composables/useAdminImages'
import { usageKey } from '../../../composables/useAdminImages'
import { ACCEPTED_IMAGE_TYPES, describeRatio } from '../../../../utils/image-validation'

/**
 * The replace flow for one slot, in a native modal <dialog>: the browser
 * supplies the focus trap, Escape to close and the inert page behind it,
 * and returns focus to the button that opened it. Uploaded files are
 * validated and optimized on the server before entering the shared draft.
 */
const props = defineProps<{ entry: SiteImageSlot | null }>()
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()
const assetUrl = useAssetUrl()
const { slotEdits, replaceSlot, resetSlot } = useAdminImagesContext()

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const error = ref<ReplacementError | null>(null)
const dragging = ref(false)
const busy = ref(false)

const replacement = computed(() => {
  const edit = props.entry ? slotEdits.value.get(props.entry.id) : undefined
  return edit?.kind === 'replace' ? edit.image : undefined
})
const title = computed(() => props.entry ? t(usageKey(props.entry.section)) : '')
const slotRatio = computed(() => props.entry ? describeRatio(props.entry.frame.width, props.entry.frame.height) : '')

watch(() => props.entry, (entry) => {
  error.value = null
  if (entry) dialog.value?.showModal()
  else dialog.value?.close()
}, { flush: 'post' })

async function take(file: File | undefined) {
  if (!file || !props.entry || busy.value) return
  busy.value = true
  error.value = await replaceSlot(props.entry, file)
  busy.value = false
}

function onPick(event: Event) {
  const input = event.target as HTMLInputElement
  take(input.files?.[0])
  // Cleared so choosing the same file again still fires a change.
  input.value = ''
}

function onDrop(event: DragEvent) {
  dragging.value = false
  take(event.dataTransfer?.files?.[0])
}
</script>

<template>
  <dialog
    ref="dialog"
    class="replacer"
    aria-labelledby="replacer-title"
    @close="emit('close')"
  >
    <div
      v-if="entry"
      class="replacer__inner"
    >
      <header class="replacer__head">
        <h2 id="replacer-title">
          {{ t('admin.images.replacing', { name: title }) }}
        </h2>
        <button
          type="button"
          class="replacer__close"
          :aria-label="t('admin.common.close')"
          @click="dialog?.close()"
        >
          ×
        </button>
      </header>

      <div class="replacer__compare">
        <figure>
          <figcaption>{{ t('admin.images.current') }}</figcaption>
          <div
            class="frame"
            :style="{ aspectRatio: frameAspect(entry.frame) }"
          >
            <img
              v-if="entry.image"
              :src="assetUrl(entry.image.src)"
              alt=""
            >
            <HomeEditorialVisual
              v-else
              treatment="photography"
              :aspect="frameAspect(entry.frame)"
            />
          </div>
          <p
            class="replacer__meta"
            dir="ltr"
          >
            {{ entry.frame.width }} × {{ entry.frame.height }} · {{ slotRatio }}
          </p>
        </figure>

        <figure>
          <figcaption>{{ t('admin.images.replacement') }}</figcaption>
          <!-- A label around the file input: the whole zone is the click
               target, and the input stays the real, keyboard-reachable
               control rather than a div pretending to be one. -->
          <label
            v-if="!replacement"
            class="drop"
            :class="{ 'is-dragging': dragging }"
            :style="{ aspectRatio: frameAspect(entry.frame) }"
            @dragover.prevent="dragging = true"
            @dragleave="dragging = false"
            @drop.prevent="onDrop"
          >
            <input
              type="file"
              class="drop__input"
              :disabled="busy"
              :accept="ACCEPTED_IMAGE_TYPES.join(',')"
              :aria-describedby="error ? 'replacer-error' : 'replacer-accepted'"
              @change="onPick"
            >
            <AdminIcon name="image" />
            <span class="drop__title">{{ t('admin.images.choose') }}</span>
            <span class="drop__hint">{{ t('admin.images.drop') }}</span>
          </label>
          <div
            v-else
            class="frame"
            :style="{ aspectRatio: frameAspect(entry.frame) }"
          >
            <img
              :src="replacement.url"
              alt=""
            >
          </div>
          <p
            v-if="replacement"
            class="replacer__meta"
            dir="ltr"
          >
            {{ replacement.width }} × {{ replacement.height }} · {{ describeRatio(replacement.width, replacement.height) }}
          </p>
          <p
            v-else
            id="replacer-accepted"
            class="replacer__meta"
          >
            {{ t('admin.images.accepted') }}
          </p>
        </figure>
      </div>

      <p
        v-if="error"
        id="replacer-error"
        class="notice notice--error"
        role="alert"
      >
        {{ t(`admin.images.errors.${error}`) }}
      </p>

      <template v-if="replacement">
        <p class="replacer__hint">
          {{ t('admin.images.previewHint', { ratio: slotRatio }) }}
        </p>
        <ul
          v-if="replacement.fit.tooSmall || replacement.fit.cropped"
          class="warnings"
        >
          <li
            v-if="replacement.fit.tooSmall"
            class="notice notice--warning"
          >
            {{ t('admin.images.warnings.tooSmall', { width: replacement.width, min: replacement.fit.minWidth }) }}
          </li>
          <li
            v-if="replacement.fit.cropped"
            class="notice notice--warning"
          >
            {{ t('admin.images.warnings.cropped', { actual: describeRatio(replacement.width, replacement.height), slot: slotRatio }) }}
          </li>
        </ul>
        <p class="replacer__hint">
          {{ t('admin.images.onSave') }}
        </p>
      </template>

      <footer class="replacer__foot">
        <button
          v-if="replacement"
          type="button"
          class="admin-btn admin-btn--small"
          @click="resetSlot(entry.id)"
        >
          {{ t('admin.images.undo') }}
        </button>
        <span class="replacer__spacer" />
        <span
          v-if="busy"
          class="replacer__hint"
          role="status"
        >…</span>
        <button
          type="button"
          class="admin-btn admin-btn--primary admin-btn--small"
          @click="dialog?.close()"
        >
          {{ t('admin.common.close') }}
        </button>
      </footer>
    </div>
  </dialog>
</template>

<style scoped>
/* margin: auto restores the native centring the site-wide reset removes. */
.replacer {
  inline-size: min(100% - 2rem, 52rem);
  margin: auto;
  max-block-size: calc(100svh - 2rem);
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  box-shadow: 0 24px 64px rgb(0 0 0 / 0.5);
}

.replacer::backdrop {
  background: rgb(8 10 12 / 0.7);
}

.replacer__inner {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: clamp(1.25rem, 3vw, 1.75rem);
}

.replacer__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.replacer__head h2 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.replacer__close {
  display: grid;
  place-items: center;
  inline-size: 36px;
  block-size: 36px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: none;
  color: var(--color-text-muted);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
}

.replacer__compare {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.replacer__compare figure {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  min-inline-size: 0;
}

.replacer__compare figcaption {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 600;
}

.frame {
  max-block-size: 22rem;
  overflow: hidden;
  border-radius: 10px;
  background: var(--color-bg-alt);
}

.frame img {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.frame :deep(.editorial-visual) {
  block-size: 100%;
  border-radius: 0;
}

.drop {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  max-block-size: 22rem;
  min-block-size: 10rem;
  padding: 1rem;
  border: 1.5px dashed var(--color-border-strong);
  border-radius: 10px;
  background: var(--color-bg-alt);
  color: var(--color-text-muted);
  text-align: center;
  cursor: pointer;
  transition:
    border-color var(--motion-duration-fast) var(--motion-ease),
    background-color var(--motion-duration-fast) var(--motion-ease);
}

.drop:hover,
.drop.is-dragging {
  border-color: var(--admin-accent);
  background: var(--admin-success-bg);
  color: var(--color-text);
}

.drop:focus-within {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Visually hidden but still the focusable, labelled control. */
.drop__input {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  opacity: 0;
}

.drop__title {
  color: var(--color-text);
  font-weight: 600;
}

.drop__hint,
.replacer__meta,
.replacer__hint {
  max-inline-size: none;
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.warnings {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.notice {
  max-inline-size: none;
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.8125rem;
}

.notice--warning {
  background: var(--admin-warning-bg);
  color: var(--admin-warning);
}

.notice--error {
  background: #462c2b;
  color: #f0b5ac;
}

.replacer__foot {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-block-start: 1rem;
  border-block-start: 1px solid var(--color-border);
}

.replacer__spacer {
  flex: 1;
}

@media (max-width: 640px) {
  .replacer__compare {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
