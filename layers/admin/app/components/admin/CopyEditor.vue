<script setup lang="ts">
const { t, locale } = useI18n()
const { page, query, rows, setValue, isChanged } = useAdminPageContent()
const { groupKey, groupLabel, fieldLabel } = useAdminContentLabels()
const selected = ref('')
const changedOnly = ref(false)
const language = ref<'both' | 'en' | 'ar'>('both')
const languages = computed<('en' | 'ar')[]>(() => language.value === 'both' ? (locale.value === 'ar' ? ['ar', 'en'] : ['en', 'ar']) : [language.value])
const groups = computed(() => [...new Set(rows.value.map(row => groupKey(row.path)))])
const active = computed(() => groups.value.includes(selected.value) ? selected.value : groups.value[0])
const searching = computed(() => !!query.value.trim() || changedOnly.value)
const visible = computed(() => {
  const q = query.value.trim().toLocaleLowerCase()
  return rows.value.filter(row => (!changedOnly.value || isChanged(row))
    && (searching.value || groupKey(row.path) === active.value)
    && (!q || [row.en, row.ar, fieldLabel(row.path), groupLabel(groupKey(row.path)), row.path].some(value => value.toLocaleLowerCase().includes(q))))
})
const visibleGroups = computed(() => groups.value.map(key => ({ key, rows: visible.value.filter(row => groupKey(row.path) === key) })).filter(group => group.rows.length))
const changedCount = computed(() => rows.value.filter(isChanged).length)
function selectGroup(key: string) {
  selected.value = key
  query.value = ''
  changedOnly.value = false
}
watch(page, () => {
  selected.value = ''
  query.value = ''
  changedOnly.value = false
})
</script>

<template>
  <div class="copy-editor">
    <div class="copy-editor__tools">
      <label class="admin-field copy-editor__search">
        <span class="visually-hidden">{{ t('admin.pages.filter') }}</span>
        <AdminIcon name="search" />
        <input
          v-model="query"
          type="search"
          class="admin-field__input"
          :placeholder="t('admin.editor.search')"
        >
      </label>
      <label class="copy-editor__changed">
        <input
          v-model="changedOnly"
          type="checkbox"
        >
        {{ t('admin.editor.changedOnly') }} <span>{{ changedCount }}</span>
      </label>
      <label class="copy-editor__language">
        <span>{{ t('admin.editor.language') }}</span>
        <select
          v-model="language"
          class="admin-field__input"
        >
          <option value="both">{{ t('admin.editor.both') }}</option>
          <option value="en">{{ t('admin.common.english') }}</option>
          <option value="ar">{{ t('admin.common.arabic') }}</option>
        </select>
      </label>
    </div>
    <div class="copy-editor__body">
      <nav
        class="copy-editor__sections"
        :aria-label="t('admin.editor.sections')"
      >
        <p>{{ t('admin.editor.sections') }}</p>
        <button
          v-for="key in groups"
          :key="key"
          type="button"
          :aria-pressed="!searching && key === active"
          @click="selectGroup(key)"
        >
          <span>{{ groupLabel(key) }}</span>
          <span class="copy-editor__count">{{ rows.filter(row => groupKey(row.path) === key).length }}</span>
          <span
            v-if="rows.some(row => groupKey(row.path) === key && isChanged(row))"
            class="admin-change-dot"
            :aria-label="t('admin.live.unsaved')"
          />
        </button>
      </nav>
      <div class="copy-editor__content">
        <p class="copy-editor__summary">
          {{ t('admin.pages.count', { count: visible.length }) }} <span>· {{ t('admin.editor.draftHint') }}</span>
        </p>
        <section
          v-for="group in visibleGroups"
          :key="group.key"
          class="copy-editor__group"
          :aria-labelledby="`group-${group.key}`"
        >
          <h2 :id="`group-${group.key}`">
            {{ groupLabel(group.key) }}
          </h2>
          <div
            v-for="row in group.rows"
            :key="`${page}:${row.path}`"
            class="copy-field"
            :class="{ 'copy-field--changed': isChanged(row) }"
            :data-field="row.path"
          >
            <div class="copy-field__head">
              <h3>{{ fieldLabel(row.path) }}</h3>
              <span
                v-if="isChanged(row)"
                class="copy-field__badge"
              >{{ t('admin.contactInfo.changed') }}</span>
            </div>
            <div
              class="copy-field__pair"
              :class="{ 'copy-field__pair--single': language !== 'both' }"
            >
              <label
                v-for="lang in languages"
                :key="lang"
                class="admin-field"
              >
                <span class="copy-field__lang">{{ t(`admin.common.${lang === 'en' ? 'english' : 'arabic'}`) }}</span>
                <textarea
                  class="admin-field__input"
                  :value="row[lang]"
                  :data-lang="lang"
                  :aria-label="`${groupLabel(group.key)} — ${fieldLabel(row.path)} — ${t(`admin.common.${lang === 'en' ? 'english' : 'arabic'}`)}`"
                  :dir="lang === 'ar' ? 'rtl' : 'ltr'"
                  :lang="lang"
                  :rows="row[lang].length > 110 ? 4 : 2"
                  maxlength="8000"
                  @input="setValue(row, lang, ($event.target as HTMLTextAreaElement).value)"
                />
              </label>
            </div>
          </div>
        </section>
        <div
          v-if="!visible.length"
          class="copy-editor__empty admin-panel"
        >
          <AdminIcon name="search" />
          <h2>{{ t('admin.editor.noResults') }}</h2>
          <p>{{ t('admin.editor.noResultsHint') }}</p>
          <button
            class="admin-btn"
            @click="query = ''; changedOnly = false"
          >
            {{ t('admin.editor.clearFilters') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.copy-editor__tools { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-block-end: 1.25rem; }
.copy-editor__search { flex: 1 1 16rem; position: relative; }
.copy-editor__search > .admin-icon { position: absolute; inset-inline-start: .8rem; inset-block-start: 50%; transform: translateY(-50%); color: var(--color-text-muted); }
.copy-editor__search input { padding-inline-start: 2.5rem; }
.copy-editor__changed, .copy-editor__language { display: flex; align-items: center; gap: .5rem; font-size: .8125rem; }
.copy-editor__changed { min-block-size: 44px; cursor: pointer; }
.copy-editor__changed input { inline-size: 18px; block-size: 18px; accent-color: var(--admin-accent); }
.copy-editor__changed > span { color: var(--admin-warning); font-variant-numeric: tabular-nums; }
.copy-editor__language select { inline-size: auto; max-inline-size: 12rem; padding: .6rem; }
.copy-editor__body { display: grid; grid-template-columns: 12rem minmax(0, 1fr); gap: 1.5rem; align-items: start; }
.copy-editor__sections { position: sticky; inset-block-start: 1rem; display: grid; gap: .3rem; }
.copy-editor__sections > p { margin: 0 0 .5rem; padding-inline: .75rem; color: var(--color-text-muted); font-size: .75rem; }
.copy-editor__sections button { display: flex; align-items: center; gap: .5rem; text-align: start; min-block-size: 44px; padding: .65rem .75rem; border: 1px solid transparent; border-radius: 8px; color: var(--color-text-muted); font: inherit; font-size: .875rem; cursor: pointer; }
.copy-editor__sections button:hover { background: var(--color-bg); color: var(--color-text); }
.copy-editor__sections button[aria-pressed=true] { background: var(--admin-success-bg); border-color: #49635a; color: var(--admin-accent); }
.copy-editor__count { margin-inline-start: auto; font-size: .75rem; font-variant-numeric: tabular-nums; }
.copy-editor__summary { margin: 0 0 1rem; color: var(--color-text-muted); font-size: .8125rem; }
.copy-editor__group + .copy-editor__group { margin-block-start: 2rem; }
.copy-editor__group > h2 { margin: 0 0 1rem; font-size: 1.15rem; }
.copy-field { padding: 1.1rem; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-bg); margin-block-end: .875rem; }
.copy-field--changed { border-inline-start: 3px solid var(--admin-warning); }
.copy-field__head { display: flex; gap: .75rem; align-items: center; justify-content: space-between; margin-block-end: .75rem; }
.copy-field__head h3 { margin: 0; font-size: .875rem; font-weight: 600; }
.copy-field__badge { color: var(--admin-warning); font-size: .75rem; }
.copy-field__pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.copy-field__lang { color: var(--color-text-muted); font-size: .75rem; }
.copy-field textarea { background: var(--color-bg-alt); line-height: 1.7; padding: .75rem; border-color: var(--color-border-strong); }
.copy-field__pair--single { grid-template-columns: minmax(0, 1fr); }
.copy-editor__empty { padding: 2rem; text-align: center; }
.copy-editor__empty h2 { font-size: 1rem; }
.copy-editor__empty p { color: var(--color-text-muted); font-size: .875rem; }
@media (max-width: 1100px) { .copy-editor__body { grid-template-columns: minmax(0, 1fr); gap: 1rem; } .copy-editor__sections { position: static; display: flex; overflow-x: auto; padding: .25rem; } .copy-editor__sections > p { display: none; } .copy-editor__sections button { white-space: nowrap; flex-shrink: 0; } }
@media (max-width: 680px) { .copy-field__pair { grid-template-columns: minmax(0, 1fr); } .copy-editor__tools { gap: .6rem 1rem; } .copy-editor__search { flex-basis: 100%; } .copy-editor__language { margin-inline-start: auto; } .copy-editor__summary span { display: block; } .copy-field { padding: 1rem; } }
</style>
