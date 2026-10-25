<script setup lang="ts">
import type { ReplacementError } from '../../../composables/useAdminImages'
import { ACCEPTED_IMAGE_TYPES } from '../../../../utils/image-validation'

/**
 * Brand and partner logos. Each one is changed once here and the change
 * reaches every place that shows it. The roster itself is fixed: this
 * changes artwork, not who appears.
 */
const { t } = useI18n()
const assetUrl = useAssetUrl()
const { logos, uploadLogo, setLogo, restoreLogo, discardLogo } = useAdminMediaContext()

const groups = computed(() => (['brand', 'partner'] as const).map(group => ({
  group,
  heading: t(group === 'brand' ? 'admin.media.brandLogos' : 'admin.media.partnerLogos'),
  items: logos.value.filter(logo => logo.group === group),
})))
const nameOf = (logo: { name: string }) => logo.name || t('admin.team.unnamed')
const errors = ref<Record<string, ReplacementError | undefined>>({})
const busy = ref<string | null>(null)
const picking = ref<string | null>(null)
const pickingLogo = computed(() => logos.value.find(logo => logo.id === picking.value))

async function onPick(id: string, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  // Cleared so choosing the same file again still fires a change.
  input.value = ''
  if (!file || busy.value) return
  busy.value = id
  errors.value[id] = (await uploadLogo(id, file)) ?? undefined
  busy.value = null
}
</script>

<template>
  <section
    class="logos"
    aria-labelledby="logos-heading"
  >
    <div class="admin-block__head">
      <div>
        <h2
          id="logos-heading"
          class="logos__heading"
        >
          {{ t('admin.media.tabs.logos') }}
        </h2>
        <p class="logos__hint">
          {{ t('admin.media.logosHint') }}
        </p>
      </div>
    </div>

    <section
      v-for="entry in groups"
      :key="entry.group"
      class="logos__group"
      :aria-labelledby="`logos-${entry.group}`"
    >
      <h3
        :id="`logos-${entry.group}`"
        class="logos__subheading"
      >
        {{ entry.heading }} <span class="logos__count">({{ entry.items.length }})</span>
      </h3>
      <ul class="logos__grid">
        <li
          v-for="logo in entry.items"
          :key="logo.id"
          class="admin-panel logo"
          :class="{ 'is-edited': logo.edited }"
        >
          <div class="logo__art">
            <img
              :src="assetUrl(logo.current.src)"
              :width="logo.current.width"
              :height="logo.current.height"
              alt=""
              loading="lazy"
            >
          </div>
          <p
            class="logo__name"
            dir="auto"
          >
            {{ nameOf(logo) }}
          </p>
          <p
            v-if="logo.edited || logo.replaced"
            class="logo__state"
          >
            {{ logo.edited ? t('admin.media.unsaved') : t('admin.media.replaced') }}
          </p>
          <div class="logo__actions">
            <label class="admin-btn admin-btn--small logo__upload">
              <input
                type="file"
                class="logo__input"
                :disabled="Boolean(busy)"
                :accept="ACCEPTED_IMAGE_TYPES.join(',')"
                @change="onPick(logo.id, $event)"
              >
              {{ t('admin.media.uploadLogo') }}
              <span class="visually-hidden">{{ nameOf(logo) }}</span>
            </label>
            <button
              type="button"
              class="admin-btn admin-btn--small"
              :disabled="Boolean(busy)"
              @click="picking = logo.id"
            >
              {{ t('admin.media.fromLibrary') }}
              <span class="visually-hidden">{{ nameOf(logo) }}</span>
            </button>
            <button
              v-if="logo.edited"
              type="button"
              class="admin-btn admin-btn--small"
              @click="discardLogo(logo.id)"
            >
              {{ t('admin.media.discard') }}
              <span class="visually-hidden">{{ nameOf(logo) }}</span>
            </button>
            <button
              v-else-if="logo.replaced"
              type="button"
              class="admin-btn admin-btn--small"
              @click="restoreLogo(logo.id)"
            >
              {{ t('admin.media.restoreOriginal') }}
              <span class="visually-hidden">{{ nameOf(logo) }}</span>
            </button>
          </div>
          <p
            v-if="busy === logo.id"
            class="logo__state"
            role="status"
          >
            …
          </p>
          <p
            v-if="errors[logo.id]"
            class="logo__error"
            role="alert"
          >
            {{ t(`admin.images.errors.${errors[logo.id]}`) }}
          </p>
        </li>
      </ul>
    </section>

    <AdminMediaPicker
      :open="Boolean(pickingLogo)"
      :heading="pickingLogo ? t('admin.media.chooseForLogo', { name: nameOf(pickingLogo) }) : ''"
      :kinds="['logo', 'upload']"
      :taken="pickingLogo ? [pickingLogo.current.src] : []"
      @pick="pickingLogo && setLogo(pickingLogo.id, $event)"
      @close="picking = null"
    />
  </section>
</template>

<style scoped>
.logos {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.logos__heading {
  margin: 0;
  font-size: var(--font-size-h4);
}

.logos__hint {
  max-inline-size: none;
  margin: var(--space-1) 0 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-label);
}

.logos__group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.logos__subheading {
  margin: 0;
  font-size: var(--font-size-small);
  font-weight: 600;
}

.logos__count {
  color: var(--color-text-muted);
  font-weight: 400;
}

.logos__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 13rem), 1fr));
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.logo {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
}

.logo.is-edited {
  border-color: var(--admin-warning);
}

.logo__art {
  display: grid;
  place-items: center;
  block-size: 5rem;
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  background: var(--admin-logo-surface);
}

/* Fixed caps: the auto-sized grid row gives a percentage height nothing to resolve against. */
.logo__art img {
  inline-size: auto;
  block-size: auto;
  max-inline-size: 100%;
  max-block-size: 4rem;
  object-fit: contain;
}

.logo__name {
  margin: 0;
  font-size: var(--font-size-small);
  font-weight: 600;
}

.logo__state {
  max-inline-size: none;
  margin: 0;
  color: var(--admin-warning);
  font-size: var(--font-size-label);
}

.logo__error {
  max-inline-size: none;
  margin: 0;
  color: var(--admin-error-text);
  font-size: var(--font-size-label);
}

.logo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-block-start: auto;
}

.logo__upload {
  position: relative;
  cursor: pointer;
}

.logo__upload:focus-within {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Visually hidden but still the focusable, labelled control. */
.logo__input {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  opacity: 0;
}
</style>
