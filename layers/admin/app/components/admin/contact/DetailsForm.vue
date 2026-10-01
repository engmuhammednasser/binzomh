<script setup lang="ts">
import { dialable } from '#shared/utils/contact-validation'

const { t } = useI18n()
const { draft, errors, changedFields } = useAdminContactInfoContext()
const changed = (key: string) => changedFields.value.includes(key)
</script>

<template>
  <section
    class="admin-panel card"
    aria-labelledby="contact-details-heading"
  >
    <header class="card__head">
      <h2 id="contact-details-heading">
        {{ t('admin.contactInfo.details') }}
      </h2>
      <p>{{ t('admin.contactInfo.detailsHint') }}</p>
    </header>

    <div class="card__grid">
      <AdminContactField
        id="contact-phone"
        :label="t('admin.contactInfo.phone')"
        :hint="draft.phone && !errors.phone ? t('admin.contactInfo.dialsAs', { tel: dialable(draft.phone) }) : t('admin.contactInfo.phoneHelp')"
        :error="errors.phone"
        :changed="changed('phone')"
      >
        <template #default="{ id, describedBy, invalid }">
          <input
            :id="id"
            v-model="draft.phone"
            type="tel"
            inputmode="tel"
            autocomplete="off"
            class="admin-field__input"
            dir="ltr"
            :aria-describedby="describedBy"
            :aria-invalid="invalid || undefined"
          >
        </template>
      </AdminContactField>

      <AdminContactField
        id="contact-email"
        :label="t('admin.contactInfo.email')"
        :error="errors.email"
        :changed="changed('email')"
      >
        <template #default="{ id, describedBy, invalid }">
          <input
            :id="id"
            v-model="draft.email"
            type="email"
            autocomplete="off"
            class="admin-field__input"
            dir="ltr"
            :aria-describedby="describedBy"
            :aria-invalid="invalid || undefined"
          >
        </template>
      </AdminContactField>
    </div>

    <!-- Address and hours are written per language on the site, so each is
         an English/Arabic pair, every input in its own direction. A labelled
         group rather than a fieldset: a <legend> is not laid out as a grid
         item, so it took a cell and pushed the Arabic field down a row. -->
    <div
      v-for="field in (['address', 'hours'] as const)"
      :key="field"
      class="pair"
      role="group"
      :aria-labelledby="`contact-${field}-label`"
    >
      <p
        :id="`contact-${field}-label`"
        class="pair__label"
      >
        {{ t(`admin.contactInfo.${field}`) }}
      </p>
      <AdminContactField
        :id="`contact-${field}-en`"
        :label="t('admin.contactInfo.english')"
        :error="errors[`${field}En`]"
        :changed="changed(`${field}En`)"
      >
        <template #default="{ id, describedBy, invalid }">
          <input
            :id="id"
            v-model="draft[`${field}En`]"
            class="admin-field__input"
            dir="ltr"
            lang="en"
            :aria-describedby="describedBy"
            :aria-invalid="invalid || undefined"
          >
        </template>
      </AdminContactField>
      <AdminContactField
        :id="`contact-${field}-ar`"
        :label="t('admin.contactInfo.arabic')"
        :error="errors[`${field}Ar`]"
        :changed="changed(`${field}Ar`)"
      >
        <template #default="{ id, describedBy, invalid }">
          <input
            :id="id"
            v-model="draft[`${field}Ar`]"
            class="admin-field__input"
            dir="rtl"
            lang="ar"
            :aria-describedby="describedBy"
            :aria-invalid="invalid || undefined"
          >
        </template>
      </AdminContactField>
    </div>
  </section>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: clamp(1.25rem, 2.5vw, 1.75rem);
}

.card__head h2 {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 600;
}

.card__head p {
  max-inline-size: none;
  margin: 0.25rem 0 0;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.card__grid,
.pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.pair {
  padding-block-start: 1rem;
  border-block-start: 1px solid var(--color-border);
}

.pair__label {
  grid-column: 1 / -1;
  max-inline-size: none;
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

@media (max-width: 640px) {
  .card__grid,
  .pair {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
