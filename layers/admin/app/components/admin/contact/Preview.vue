<script setup lang="ts">
import { dialable, SOCIAL_PLATFORMS } from '#shared/utils/contact-validation'
import { SOCIAL_LABELS } from '../../../composables/useAdminContactInfo'

/**
 * A live sketch of the footer's contact column, in the active language,
 * so an edit can be judged where readers will actually meet it. Invalid
 * values are left out, the way a save would refuse them; an empty social
 * list hides "Follow us" exactly as AppFooter does.
 */
const { t, locale } = useI18n()
const { draft, errors } = useAdminContactInfoContext()

const isAr = computed(() => locale.value === 'ar')
const address = computed(() => (isAr.value ? draft.addressAr : draft.addressEn).trim())
const hours = computed(() => (isAr.value ? draft.hoursAr : draft.hoursEn).trim())
const social = computed(() => SOCIAL_PLATFORMS.filter(platform =>
  draft.social[platform].trim() && !errors.value[`social.${platform}`],
))
</script>

<template>
  <aside
    class="preview"
    aria-labelledby="contact-preview-heading"
  >
    <div class="preview__head">
      <h2 id="contact-preview-heading">
        {{ t('admin.contactInfo.preview') }}
      </h2>
      <p>{{ t('admin.contactInfo.previewHint') }}</p>
    </div>

    <!-- Presentational only: nothing here is a real link, so the preview
         never dials or opens anything while being edited. -->
    <div
      class="footer"
      aria-hidden="true"
    >
      <BaseLogo
        variant="light"
        size="1.5rem"
      />

      <p class="footer__label">
        {{ t('footer.contact') }}
      </p>
      <ul class="footer__lines">
        <li :class="{ 'is-empty': !draft.phone.trim() || errors.phone }">
          <span dir="ltr">{{ !errors.phone ? draft.phone : t('admin.contactInfo.empty') }}</span>
          <small
            v-if="!errors.phone"
            dir="ltr"
          >tel:{{ dialable(draft.phone) }}</small>
        </li>
        <li :class="{ 'is-empty': errors.email }">
          <span dir="ltr">{{ !errors.email ? draft.email : t('admin.contactInfo.empty') }}</span>
        </li>
        <li :class="{ 'is-empty': !address }">
          {{ address || t('admin.contactInfo.empty') }}
        </li>
        <li :class="{ 'is-empty': !hours }">
          {{ hours || t('admin.contactInfo.empty') }}
        </li>
      </ul>

      <template v-if="social.length">
        <p class="footer__label">
          {{ t('admin.contactInfo.followUs') }}
        </p>
        <ul class="footer__social">
          <li
            v-for="platform in social"
            :key="platform"
          >
            {{ SOCIAL_LABELS[platform] }}
          </li>
        </ul>
      </template>
    </div>

    <p class="preview__used">
      {{ t('admin.contactInfo.usedIn') }}
    </p>
  </aside>
</template>

<style scoped>
.preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview__head h2 {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 600;
}

.preview__head p,
.preview__used {
  max-inline-size: none;
  margin: 0.25rem 0 0;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

/* The site footer's own surface, so the preview reads as the real thing
   rather than as another dashboard card. */
.footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #1a1a1a;
  color: #ffffff;
}

/* Held at its own width: as a stretched flex item the logo was scaled
   out of proportion to the column's full width. */
.footer > :first-child {
  align-self: flex-start;
}

.footer__label {
  max-inline-size: none;
  margin: 0.75rem 0 0;
  color: #dddddd;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.footer__lines,
.footer__social {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer__lines {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  font-size: 0.875rem;
}

.footer__lines li {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
}

.footer__lines small {
  color: #a8a8a8;
  font-size: 0.6875rem;
}

.footer__lines .is-empty {
  color: #a8a8a8;
  font-style: italic;
}

.footer__social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.footer__social li {
  padding: 0.25rem 0.625rem;
  border: 1px solid rgb(255 255 255 / 0.3);
  border-radius: 999px;
  font-size: 0.75rem;
}
</style>
