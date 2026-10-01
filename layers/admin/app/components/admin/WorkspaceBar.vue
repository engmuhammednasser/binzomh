<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const assetUrl = useAssetUrl()
const { state, busy, uploads, dirty, unpublished, error, notice, action, reload } = useAdminWorkspace()
const publishing = ref(false)
const confirmReload = ref(false)
const more = ref(false)
const status = computed(() => dirty.value ? 'unsaved' : unpublished.value ? 'draft' : 'live')
const previewPath = computed(() => {
  const query = route.query.page
  const page = typeof query === 'string' && ['about', 'brands', 'capabilities', 'network', 'contact'].includes(query) ? `/${query}` : '/'
  return assetUrl(`${localePath(page)}?preview=1` as `/${string}`)
})
function warnOnLeave(event: BeforeUnloadEvent) {
  if (dirty.value || uploads.value) {
    event.preventDefault()
    event.returnValue = ''
  }
}
function saveShortcut(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's' && !event.altKey) {
    event.preventDefault()
    if (dirty.value && !busy.value) void action('save')
  }
}
watch(dirty, (value) => {
  if (value) {
    publishing.value = false
    notice.value = ''
  }
})
onMounted(() => {
  window.addEventListener('beforeunload', warnOnLeave)
  window.addEventListener('keydown', saveShortcut)
})
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', warnOnLeave)
  window.removeEventListener('keydown', saveShortcut)
})
</script>

<template>
  <div
    class="workspace-bar"
    :data-state="status"
    :aria-label="t('admin.overview.publication')"
    role="region"
  >
    <div class="workspace-bar__row">
      <div class="workspace-bar__state">
        <strong
          class="workspace-bar__badge"
          aria-live="polite"
        >
          <span aria-hidden="true" />{{ t(`admin.live.${status}Short`) }}
        </strong>
        <p class="workspace-bar__hint">
          {{ t(`admin.live.${status}Hint`) }}
        </p>
      </div>
      <div class="workspace-bar__actions">
        <a
          :href="previewPath"
          target="_blank"
          rel="noopener"
          class="admin-btn admin-btn--small"
        >{{ t('admin.live.preview') }}</a>
        <button
          class="admin-btn admin-btn--small"
          :class="{ 'admin-btn--primary': dirty }"
          :disabled="busy || !dirty"
          aria-keyshortcuts="Control+s Meta+s"
          @click="action('save')"
        >
          {{ uploads ? t('admin.live.uploading') : busy ? t('admin.live.working') : t('admin.live.save') }}
        </button>
        <button
          class="admin-btn admin-btn--small"
          :class="{ 'admin-btn--primary': !dirty && unpublished }"
          :disabled="busy || dirty || !unpublished"
          :aria-expanded="publishing"
          @click="publishing = !publishing; confirmReload = false; more = false"
        >
          {{ t('admin.live.publish') }}
        </button>
      </div>
      <div class="workspace-bar__more">
        <button
          class="workspace-bar__more-button"
          :aria-label="t('admin.live.more')"
          :aria-expanded="more"
          aria-controls="workspace-more"
          @click="more = !more"
        >
          ···
        </button>
        <div
          v-if="more"
          id="workspace-more"
          class="workspace-bar__popover"
        >
          <p>{{ t('admin.live.savedVersion', { number: state?.revision ?? 0 }) }} · {{ t('admin.live.publishedVersion', { number: state?.publishedRevision ?? 0 }) }}</p>
          <button
            class="admin-btn admin-btn--small"
            :disabled="busy"
            @click="confirmReload = !confirmReload; publishing = false; more = false"
          >
            {{ t('admin.live.reload') }}
          </button>
        </div>
      </div>
    </div>
    <p
      v-if="error"
      role="alert"
      class="workspace-bar__error"
    >
      {{ error }}
    </p>
    <p
      v-if="notice"
      role="status"
    >
      {{ notice }}
    </p>
    <div
      v-if="publishing"
      class="workspace-bar__confirm"
      role="group"
      :aria-label="t('admin.live.publish')"
    >
      <p>{{ t('admin.live.publishConfirm') }}</p>
      <button
        class="admin-btn admin-btn--primary"
        :disabled="busy || dirty || !unpublished"
        @click="action('publish'); publishing = false"
      >
        {{ t('admin.live.confirmPublish') }}
      </button>
      <button
        class="admin-btn"
        @click="publishing = false"
      >
        {{ t('admin.common.close') }}
      </button>
    </div>
    <div
      v-if="confirmReload"
      class="workspace-bar__confirm"
    >
      <p>{{ t('admin.live.reloadConfirm') }}</p>
      <button
        class="admin-btn"
        :disabled="busy"
        @click="reload(); confirmReload = false"
      >
        {{ t('admin.live.confirmReload') }}
      </button>
      <button
        class="admin-btn"
        @click="confirmReload = false"
      >
        {{ t('admin.common.close') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.workspace-bar { position: sticky; bottom: 0; z-index: 10; padding: .9rem clamp(1rem, 2.5vw, 2rem); border-top: 1px solid var(--color-border-strong); background: var(--admin-rail); box-shadow: 0 -8px 24px #0003; }
.workspace-bar__row { display: flex; align-items: center; gap: .75rem; }
.workspace-bar__state { flex: 1; min-inline-size: 0; }
.workspace-bar__badge { display: inline-flex; align-items: center; gap: .5rem; color: var(--admin-success); font-size: .8125rem; }
.workspace-bar__badge > span { inline-size: 7px; block-size: 7px; border-radius: 50%; background: currentColor; }
.workspace-bar[data-state=unsaved] .workspace-bar__badge { color: var(--admin-warning); }
.workspace-bar[data-state=draft] .workspace-bar__badge { color: #b9d5f4; }
.workspace-bar__actions, .workspace-bar__confirm { display: flex; align-items: center; flex-wrap: wrap; gap: .5rem; }
.workspace-bar__actions .admin-btn { min-block-size: 44px; font-size: .8125rem; }
.workspace-bar p { margin: .3rem 0 0; font-size: .75rem; color: var(--color-text-muted); }
.workspace-bar .workspace-bar__error { color: var(--admin-error-text-strong); }
.workspace-bar__more { position: relative; }
.workspace-bar__more-button { min-inline-size: 44px; min-block-size: 44px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 1.2rem; cursor: pointer; }
.workspace-bar__popover { position: absolute; inset-block-end: calc(100% + 1rem); inset-inline-end: 0; inline-size: min(19rem, calc(100vw - 2rem)); padding: 1rem; border: 1px solid var(--color-border-strong); border-radius: 10px; background: var(--color-bg); box-shadow: 0 4px 24px #0006; }
.workspace-bar__popover p { margin: 0 0 .75rem; }
.workspace-bar__confirm { margin-top: .75rem; padding-top: .75rem; border-top: 1px solid var(--color-border); }
.workspace-bar__confirm p { flex-basis: 100%; margin-bottom: .5rem; }
@media (max-width: 1200px) { .workspace-bar__hint { display: none; } }
@media (max-width: 760px) {
  .workspace-bar { padding: .6rem 1rem; }
  .workspace-bar__row { display: grid; grid-template-columns: 1fr auto; gap: .4rem; }
  .workspace-bar__state { grid-column: 1; grid-row: 1; }
  .workspace-bar__more { grid-column: 2; grid-row: 1; }
  .workspace-bar__actions { grid-column: 1 / -1; grid-row: 2; display: grid; grid-template-columns: 1.3fr 1fr 1fr; }
  .workspace-bar__actions .admin-btn { justify-content: center; padding: .35rem; font-size: .75rem; text-align: center; }
}
</style>
