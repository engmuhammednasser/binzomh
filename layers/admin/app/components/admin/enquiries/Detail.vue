<script setup lang="ts">
import type { AdminEnquiry } from '../../../composables/useAdminEnquiries'

defineProps<{ enquiry: AdminEnquiry | null }>()
const emit = defineEmits<{ back: [] }>()

const { t, locale } = useI18n()
const { setStatus, busy } = useAdminEnquiries()
const heading = useTemplateRef<HTMLElement>('heading')

// The page moves focus here after a row is chosen, so a keyboard or
// screen-reader user lands on what they just opened — which is also why
// this panel is not an aria-live region: focus already announces it, and
// a live region would read the whole message a second time.
defineExpose({ focus: () => heading.value?.focus() })

const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

async function copyEmail(email: string) {
  try {
    await navigator.clipboard.writeText(email)
    copied.value = true
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => (copied.value = false), 2000)
  }
  catch {
    // Clipboard blocked (permissions, insecure context): the address is
    // still on screen as a mailto link, so there is nothing to recover.
  }
}

onBeforeUnmount(() => clearTimeout(copiedTimer))
</script>

<template>
  <section
    id="enquiry-detail"
    class="detail"
  >
    <template v-if="enquiry">
      <button
        type="button"
        class="admin-btn admin-btn--small detail__back"
        @click="emit('back')"
      >
        <span class="detail__back-icon"><AdminIcon name="arrow" /></span>
        {{ t('admin.enquiries.back') }}
      </button>

      <header class="detail__head">
        <div class="detail__identity">
          <span
            class="detail__avatar"
            aria-hidden="true"
          >{{ enquiry.name.slice(0, 1) }}</span>
          <div class="detail__title">
            <h2
              ref="heading"
              class="detail__name"
              tabindex="-1"
            >
              <bdi>{{ enquiry.name }}</bdi>
            </h2>
            <AdminStatus :status="enquiry.status" />
          </div>
        </div>

        <div
          class="detail__actions"
          role="group"
          :aria-label="t('admin.enquiries.actions')"
        >
          <a
            :href="`mailto:${enquiry.email}`"
            class="admin-btn admin-btn--primary admin-btn--small"
          >
            {{ t('admin.enquiries.reply') }}
          </a>
          <button
            v-if="enquiry.status !== 'replied'"
            type="button"
            class="admin-btn admin-btn--small"
            :disabled="busy"
            @click="setStatus(enquiry.id, 'replied')"
          >
            {{ t('admin.enquiries.markReplied') }}
          </button>
          <button
            v-if="enquiry.status !== 'new'"
            type="button"
            class="admin-btn admin-btn--small"
            :disabled="busy"
            @click="setStatus(enquiry.id, 'new')"
          >
            {{ t('admin.enquiries.markNew') }}
          </button>
          <button
            v-if="enquiry.status !== 'archived'"
            type="button"
            class="admin-btn admin-btn--small"
            :disabled="busy"
            @click="setStatus(enquiry.id, 'archived')"
          >
            {{ t('admin.enquiries.markArchived') }}
          </button>
        </div>
      </header>

      <!--
        One labelled fact per line instead of a "·"-joined sentence: mixing
        an English address and company with an Arabic date in one run of
        text let the bidi algorithm reorder the pieces.
      -->
      <dl class="facts">
        <div class="facts__item">
          <dt>{{ t('admin.enquiries.email') }}</dt>
          <dd class="facts__email">
            <a
              :href="`mailto:${enquiry.email}`"
              dir="ltr"
            >{{ enquiry.email }}</a>
            <button
              type="button"
              class="facts__copy"
              :aria-label="t('admin.enquiries.copy')"
              @click="copyEmail(enquiry.email)"
            >
              <AdminIcon name="copy" />
            </button>
            <span
              class="facts__copied"
              role="status"
            >{{ copied ? t('admin.enquiries.copied') : '' }}</span>
          </dd>
        </div>
        <div
          v-if="enquiry.company"
          class="facts__item"
        >
          <dt>{{ t('admin.enquiries.company') }}</dt>
          <dd><bdi>{{ enquiry.company }}</bdi></dd>
        </div>
        <div class="facts__item">
          <dt>{{ t('admin.enquiries.received') }}</dt>
          <dd>
            <time :datetime="enquiry.receivedAt">{{ formatReceived(enquiry.receivedAt, locale) }}</time>
          </dd>
        </div>
      </dl>

      <h3 class="detail__label">
        {{ t('admin.enquiries.message') }}
      </h3>
      <!-- The message itself does follow its own language, alignment
           included: it is read as a paragraph, not scanned as a label. -->
      <p
        class="detail__message"
        dir="auto"
      >
        {{ enquiry.message }}
      </p>
    </template>

    <div
      v-else
      class="detail__empty"
    >
      <span
        class="detail__empty-icon"
        aria-hidden="true"
      ><AdminIcon name="inbox" /></span>
      <p class="detail__empty-title">
        {{ t('admin.enquiries.selectTitle') }}
      </p>
      <p class="detail__empty-body">
        {{ t('admin.enquiries.select') }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: clamp(1.25rem, 2.5vw, 2rem);
  overflow-wrap: anywhere;
}

/* Only the single-pane (phone) layout needs a way back to the list. */
.detail__back {
  display: none;
  align-self: flex-start;
}

.detail__back-icon {
  display: inline-flex;
  transform: rotate(180deg);
}

.detail__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem 1.5rem;
  padding-block-end: 1.25rem;
  border-block-end: 1px solid var(--color-border);
}

.detail__identity {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-inline-size: 0;
}

.detail__avatar {
  display: grid;
  place-items: center;
  flex: 0 0 3rem;
  block-size: 3rem;
  border-radius: 50%;
  background: var(--color-bg-raised);
  color: var(--admin-accent);
  font-size: 1.125rem;
  font-weight: 600;
}

.detail__title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.375rem;
  min-inline-size: 0;
}

.detail__name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
}

.detail__name:focus-visible {
  outline-offset: 4px;
}

.detail__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 0.75rem;
  margin: 0;
}

.facts__item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: var(--color-bg-alt);
}

.facts dt {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.facts dd {
  margin: 0;
  font-size: 0.875rem;
}

.facts__email {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-inline-size: 0;
}

/* One line, clipped if it must be: an address broken mid-domain is harder
   to read than one that ends in an ellipsis beside its copy button. */
.facts__email a {
  display: block;
  min-inline-size: 0;
  overflow: hidden;
  overflow-wrap: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text);
}

.facts__copy {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  inline-size: 28px;
  block-size: 28px;
  border: 0;
  border-radius: 6px;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
}

.facts__copy:hover {
  background: var(--color-bg-raised);
  color: var(--color-text);
}

.facts__copy :deep(svg) {
  inline-size: 16px;
  block-size: 16px;
}

.facts__copied {
  color: var(--admin-success);
  font-size: 0.75rem;
}

.detail__label {
  margin: 0 0 -0.75rem;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 600;
}

/* max-inline-size: none undoes the site's 38rem cap on every <p>, which
   left an English message box short of the panel's far edge. */
.detail__message {
  max-inline-size: none;
  margin: 0;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg-alt);
  font-size: 0.9375rem;
  line-height: 1.8;
  white-space: pre-line;
}

.detail__empty {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-block-size: 20rem;
  text-align: center;
}

.detail__empty-icon {
  display: grid;
  place-items: center;
  inline-size: 3.5rem;
  block-size: 3.5rem;
  margin-block-end: 0.5rem;
  border-radius: 50%;
  background: var(--color-bg-raised);
  color: var(--color-text-muted);
}

.detail__empty-title {
  margin: 0;
  font-weight: 600;
}

.detail__empty-body {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

@media (max-width: 900px) {
  .detail__back {
    display: inline-flex;
  }
}
</style>
