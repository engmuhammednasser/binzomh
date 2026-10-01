<script setup lang="ts">
import type { BrandProfile } from '~~/types/brands'

const props = defineProps<{ brand: BrandProfile }>()
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()

const { draft: workspace } = useAdminWorkspace()
const brand = computed(() => workspace.value!.brands.find(brand => brand.slug === props.brand.slug)!)
function fieldModel(field: 'introduction' | 'relationship', lang: 'en' | 'ar') {
  return computed({
    get: () => brand.value[field]?.content?.[lang] ?? '',
    set: (value: string) => {
      const entry = brand.value[field] ??= { status: 'draft', content: { en: '', ar: '' } }
      entry.content ??= { en: '', ar: '' }
      entry.content[lang] = value
    },
  })
}
const draft = reactive({
  name: computed({ get: () => brand.value.name, set: (value) => { brand.value.name = value } }),
  introEn: fieldModel('introduction', 'en'), introAr: fieldModel('introduction', 'ar'),
  relEn: fieldModel('relationship', 'en'), relAr: fieldModel('relationship', 'ar'),
})
function setApproval(field: 'introduction' | 'relationship', approved: boolean) {
  const entry = brand.value[field] ??= { status: 'draft', content: { en: '', ar: '' } }
  entry.status = approved ? 'approved' : 'draft'
}
</script>

<template>
  <section
    class="admin-panel admin-editor"
    :aria-label="t('admin.brands.editing', { name: brand.name })"
  >
    <div class="admin-editor__head">
      <h2 class="text-h4 admin-editor__title">
        {{ t('admin.brands.editing', { name: brand.name }) }}
      </h2>
      <button
        type="button"
        class="admin-btn admin-btn--small"
        @click="emit('close')"
      >
        {{ t('admin.common.close') }}
      </button>
    </div>

    <label class="admin-field">
      <span class="admin-field__label">{{ t('admin.brands.name') }}</span>
      <input
        v-model="draft.name"
        class="admin-field__input"
        type="text"
      >
    </label>

    <fieldset class="admin-pair">
      <legend class="admin-field__label">
        {{ t('admin.brands.introduction') }}
      </legend>
      <label class="admin-field">
        <span class="text-small text-muted">{{ t('admin.common.english') }}</span>
        <textarea
          v-model="draft.introEn"
          class="admin-field__input"
          rows="4"
          dir="ltr"
          lang="en"
        />
      </label>
      <label class="admin-field">
        <span class="text-small text-muted">{{ t('admin.common.arabic') }}</span>
        <textarea
          v-model="draft.introAr"
          class="admin-field__input"
          rows="4"
          dir="rtl"
          lang="ar"
        />
      </label>
    </fieldset>

    <fieldset class="admin-pair">
      <legend class="admin-field__label">
        {{ t('admin.brands.relationship') }}
      </legend>
      <label class="admin-field">
        <span class="text-small text-muted">{{ t('admin.common.english') }}</span>
        <textarea
          v-model="draft.relEn"
          class="admin-field__input"
          rows="3"
          dir="ltr"
          lang="en"
        />
      </label>
      <label class="admin-field">
        <span class="text-small text-muted">{{ t('admin.common.arabic') }}</span>
        <textarea
          v-model="draft.relAr"
          class="admin-field__input"
          rows="3"
          dir="rtl"
          lang="ar"
        />
      </label>
    </fieldset>

    <div class="admin-editor__foot">
      <label
        v-for="field in (['introduction', 'relationship'] as const)"
        :key="field"
        class="admin-field"
      >
        <span><input
          type="checkbox"
          :checked="brand[field]?.status === 'approved'"
          @change="setApproval(field, ($event.target as HTMLInputElement).checked)"
        > {{ t('admin.live.approveField', { field: t(`admin.brands.${field}`) }) }}</span>
      </label>
      <p class="text-small text-muted">
        {{ t('admin.live.brandApproval') }}
      </p>
    </div>
  </section>
</template>
