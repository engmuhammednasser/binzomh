<script setup lang="ts">
import { SOCIAL_HOSTS, SOCIAL_PLATFORMS } from '../../../../utils/contact-validation'
import { SOCIAL_LABELS } from '../../../composables/useAdminContactInfo'

const { t } = useI18n()
const { draft, original, errors, changedFields } = useAdminContactInfoContext()

// Recorded in docs/unresolved-content-approvals.md item 6: no official
// profile is approved yet, which is why the site's list is empty.
const nonePublished = computed(() => SOCIAL_PLATFORMS.every(platform => !original.value.social[platform]))
</script>

<template>
  <section
    class="admin-panel card"
    aria-labelledby="contact-social-heading"
  >
    <header class="card__head">
      <h2 id="contact-social-heading">
        {{ t('admin.contactInfo.social') }}
      </h2>
      <p>{{ t('admin.contactInfo.socialHint') }}</p>
    </header>

    <p
      v-if="nonePublished"
      class="card__notice"
    >
      {{ t('admin.contactInfo.socialPending') }}
    </p>

    <div class="card__list">
      <AdminContactField
        v-for="platform in SOCIAL_PLATFORMS"
        :id="`contact-social-${platform}`"
        :key="platform"
        :label="SOCIAL_LABELS[platform]"
        :error="errors[`social.${platform}`]"
        :error-params="{ host: SOCIAL_HOSTS[platform][0]! }"
        :changed="changedFields.includes(`social.${platform}`)"
      >
        <template #default="{ id, describedBy, invalid }">
          <input
            :id="id"
            v-model="draft.social[platform]"
            type="url"
            inputmode="url"
            autocomplete="off"
            class="admin-field__input"
            dir="ltr"
            :placeholder="`https://${SOCIAL_HOSTS[platform][0]}/…`"
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
  gap: 1.25rem;
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

.card__notice {
  max-inline-size: none;
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: var(--admin-warning-bg);
  color: var(--admin-warning);
  font-size: 0.8125rem;
}

.card__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.card__list :deep(input::placeholder) {
  color: var(--color-text-subtle);
  opacity: 0.7;
}

@media (max-width: 640px) {
  .card__list {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
