<script setup lang="ts">
import { aboutContent as aboutEn } from '~~/content/en/about'

const { t, locale } = useI18n()
const assetUrl = useAssetUrl()

const { draft: workspace } = useAdminWorkspace()
const team = computed(() => (aboutEn.leadership.team ?? []).map((person, index) => {
  const value = (field: string, lang: 'en' | 'ar') => workspace.value?.copy.about.find(row => row.path === `leadership.team.${index}.${field}`)?.[lang] ?? ''
  return { slug: person.slug, index, nameEn: value('name', 'en'), nameAr: value('name', 'ar'), roleEn: value('role', 'en'), roleAr: value('role', 'ar') }
}))
const displayName = (person: typeof team.value[number]) => locale.value === 'ar' ? person.nameAr : person.nameEn
const editingSlug = ref<string | null>(null)
const editing = computed(() => team.value.find(entry => entry.slug === editingSlug.value) ?? null)
const path = (field: string) => () => `leadership.team.${editing.value?.index}.${field}`
const draft = reactive({
  nameEn: useAdminCopyField('about', path('name'), 'en'), nameAr: useAdminCopyField('about', path('name'), 'ar'),
  roleEn: useAdminCopyField('about', path('role'), 'en'), roleAr: useAdminCopyField('about', path('role'), 'ar'),
})
function edit(slug: string) {
  editingSlug.value = slug
}
</script>

<template>
  <section
    id="team-members"
    class="admin-block"
  >
    <div class="admin-block__head">
      <h2 class="text-h4 admin-block__title">
        {{ t('admin.team.teamHeading') }}
      </h2>
    </div>

    <ul class="people">
      <li
        v-for="person in team"
        :key="person.slug"
        class="admin-panel person"
        :class="{ 'is-editing': person.slug === editingSlug }"
      >
        <img
          :src="assetUrl(`/images/about/team/thumbs/${person.slug}.jpeg`)"
          width="132"
          height="132"
          alt=""
          class="person__photo"
          loading="lazy"
        >
        <div class="person__text">
          <p class="person__name">
            {{ displayName(person) }}
          </p>
          <p class="text-small text-muted person__role">
            {{ locale === 'ar' ? person.roleAr : person.roleEn }}
          </p>
        </div>
        <button
          type="button"
          class="admin-btn admin-btn--small"
          @click="edit(person.slug)"
        >
          {{ t('admin.common.edit') }}
          <span class="visually-hidden">{{ displayName(person) }}</span>
        </button>
      </li>
    </ul>

    <section
      v-if="editing"
      class="admin-panel admin-editor"
      :aria-label="t('admin.team.editing', { name: displayName(editing) })"
    >
      <div class="admin-editor__head">
        <h3 class="text-h4 admin-editor__title">
          {{ t('admin.team.editing', { name: displayName(editing) }) }}
        </h3>
        <button
          type="button"
          class="admin-btn admin-btn--small"
          @click="editingSlug = null"
        >
          {{ t('admin.common.close') }}
        </button>
      </div>

      <fieldset class="admin-pair">
        <legend class="admin-field__label">
          {{ t('admin.team.name') }}
        </legend>
        <label class="admin-field">
          <span class="text-small text-muted">{{ t('admin.common.english') }}</span>
          <input
            v-model="draft.nameEn"
            class="admin-field__input"
            dir="ltr"
            lang="en"
          >
        </label>
        <label class="admin-field">
          <span class="text-small text-muted">{{ t('admin.common.arabic') }}</span>
          <input
            v-model="draft.nameAr"
            class="admin-field__input"
            dir="rtl"
            lang="ar"
          >
        </label>
      </fieldset>

      <fieldset class="admin-pair">
        <legend class="admin-field__label">
          {{ t('admin.team.role') }}
        </legend>
        <label class="admin-field">
          <span class="text-small text-muted">{{ t('admin.common.english') }}</span>
          <input
            v-model="draft.roleEn"
            class="admin-field__input"
            dir="ltr"
            lang="en"
          >
        </label>
        <label class="admin-field">
          <span class="text-small text-muted">{{ t('admin.common.arabic') }}</span>
          <input
            v-model="draft.roleAr"
            class="admin-field__input"
            dir="rtl"
            lang="ar"
          >
        </label>
      </fieldset>
    </section>
  </section>
</template>

<style scoped>
.people {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: var(--space-3);
}

.person {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
}

.person.is-editing {
  border-color: var(--color-text);
}

.person__photo {
  flex: 0 0 auto;
  inline-size: 3rem;
  block-size: 3rem;
  border-radius: 999px;
  object-fit: cover;
  background: var(--color-bg-raised);
}

.person__text {
  flex: 1;
  min-inline-size: 0;
}

.person__name {
  margin: 0;
  font-weight: 600;
}

.person__role {
  margin: 0;
}
</style>
