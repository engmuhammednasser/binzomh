<script setup lang="ts">
import type { ContactContent } from '~~/types/content'

/**
 * The contact page: one full-bleed split. The statement and the approved
 * contact details hold the ink panel; the enquiry form holds the white one.
 *
 * Every detail is guarded, so the page degrades field by field if any of
 * them is ever withdrawn (docs/unresolved-content-approvals.md item 6).
 */
const props = defineProps<{ content: ContactContent }>()

const { t } = useI18n()
const config = useRuntimeConfig()

const endpoint = computed(() => config.public.contactFormEndpoint as string)

/**
 * The form always renders — on the owner's call, so the published page
 * shows it before an endpoint exists. Without one it is display-only: the
 * note above it says so, the send button is disabled (which also stops an
 * Enter-key submit), and submit() cancels the native post regardless.
 */

// Derived from the single display string in the content file rather than
// stored twice, so the dialled number can never disagree with the printed
// one. Keeps "+" and digits; drops the display spacing.
const telHref = computed(() => {
  const phone = props.content.phone
  return phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : undefined
})

type Status = 'idle' | 'sending' | 'sent' | 'failed'
const status = ref<Status>('idle')

/**
 * Posts with fetch so the reader stays on the page and gets an inline
 * answer. If JavaScript never runs, the form still has a real action and
 * method and submits natively — the enhancement is the inline result, not
 * the ability to send.
 *
 * Accept: application/json is what the common form services (Formspree,
 * Formspark, Basin, Web3Forms) key off to answer with JSON instead of
 * redirecting to their own thank-you page.
 */
async function submit(event: Event) {
  const el = event.target as HTMLFormElement

  // Always stop the native submit first. Returning before this would let
  // an unconfigured form post to the current URL and reload the page,
  // which is the one outcome worse than not sending.
  event.preventDefault()
  if (!endpoint.value) return

  status.value = 'sending'

  try {
    const response = await fetch(endpoint.value, {
      method: 'POST',
      body: new FormData(el),
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) throw new Error(String(response.status))
    status.value = 'sent'
    el.reset()
  }
  catch {
    // Never swallowed into silence: the failure message carries the email
    // address, so a reader whose enquiry did not send still has a way through.
    status.value = 'failed'
  }
}
</script>

<template>
  <!--
    A full-bleed split rather than a container-bound stack. Every other
    page on the site is a column of banded sections; this one is a single
    composition, which is what a contact page should be — the statement and
    the ways to answer it, side by side, with nothing below to scroll to.

    The panels run to the viewport edges while their content still lines up
    with the site's container, via the --edge calculation in the styles.
  -->
  <section class="contact">
    <div class="contact__aside surface-inverse">
      <div class="contact__aside-inner">
        <MotionReveal :delay="0">
          <p class="text-label contact__eyebrow">
            {{ content.eyebrow }}
          </p>
        </MotionReveal>

        <MotionReveal :delay="90">
          <h1 class="contact__title">
            {{ content.title }}
          </h1>
        </MotionReveal>

        <MotionReveal :delay="180">
          <p class="text-body-lg contact__intro">
            {{ content.intro }}
          </p>
        </MotionReveal>

        <MotionReveal :delay="260">
          <h2 class="text-label contact__details-heading">
            {{ content.detailsHeading }}
          </h2>

          <!--
            Each row pairs a decorative icon with a visually-hidden label,
            so the icon alone never has to carry the meaning for
            screen-reader or forced-colors users.

            dir="ltr" on the phone and email: both are left-to-right
            Latin-script values, and without it the RTL layout moves the
            number's leading "+" to the wrong end.
          -->
          <ul class="contact__details">
            <li
              v-if="content.phone"
              class="contact__detail"
            >
              <svg
                class="contact__icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="visually-hidden">{{ t('contact.phoneLabel') }}</span>
              <a
                :href="telHref"
                class="contact__link"
                dir="ltr"
              >{{ content.phone }}</a>
            </li>

            <li
              v-if="content.email"
              class="contact__detail"
            >
              <svg
                class="contact__icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="5.5"
                  width="18"
                  height="13"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="m3.75 7 8.25 6 8.25-6"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="visually-hidden">{{ t('contact.emailLabel') }}</span>
              <a
                :href="`mailto:${content.email}`"
                class="contact__link"
                dir="ltr"
              >{{ content.email }}</a>
            </li>

            <li
              v-if="content.address"
              class="contact__detail"
            >
              <svg
                class="contact__icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 21s-7-6.1-7-11.2A7 7 0 0 1 19 9.8C19 14.9 12 21 12 21Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
                <circle
                  cx="12"
                  cy="9.8"
                  r="2.25"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
              </svg>
              <span class="visually-hidden">{{ t('contact.addressLabel') }}</span>
              <span class="contact__value">{{ content.address }}</span>
            </li>

            <li
              v-if="content.hours"
              class="contact__detail"
            >
              <svg
                class="contact__icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="8.25"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M12 7.5V12l3 1.75"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="visually-hidden">{{ t('contact.hoursLabel') }}</span>
              <span class="contact__value">{{ content.hours }}</span>
            </li>
          </ul>
        </MotionReveal>
      </div>
    </div>

    <div class="contact__main">
      <MotionReveal
        :delay="140"
        class="contact__main-inner"
      >
        <h2 class="text-h2 contact__form-heading">
          {{ content.formHeading }}
        </h2>
        <p class="text-muted contact__form-body">
          {{ content.formBody }}
        </p>

        <!-- Shown above the form whenever there is no endpoint, so a
             disabled send button is never left unexplained. -->
        <p
          v-if="!endpoint"
          class="text-small contact__notice"
        >
          {{ content.formUnavailable }}
        </p>

        <form
          class="contact-form"
          :action="endpoint || undefined"
          method="post"
          @submit="submit"
        >
          <!--
            A honeypot, not a real field: hidden from sight and from the
            accessibility tree, and excluded from the tab order. A person
            never sees it, so anything that fills it is automated. Most
            form services drop a submission whose _gotcha field is set.
          -->
          <div
            class="contact-form__bot"
            aria-hidden="true"
          >
            <label for="contact-gotcha">{{ t('contact.botField') }}</label>
            <input
              id="contact-gotcha"
              type="text"
              name="_gotcha"
              tabindex="-1"
              autocomplete="off"
            >
          </div>

          <!-- Name and email share a line from 640px up: two short fields
               stacked full-width read as a queue of boxes, not a form. -->
          <div class="contact-form__row">
            <div class="contact-form__field">
              <label
                class="contact-form__label"
                for="contact-name"
              >{{ t('contact.name') }}</label>
              <input
                id="contact-name"
                class="contact-form__input"
                type="text"
                name="name"
                autocomplete="name"
                required
              >
            </div>

            <div class="contact-form__field">
              <label
                class="contact-form__label"
                for="contact-email"
              >{{ t('contact.senderEmail') }}</label>
              <input
                id="contact-email"
                class="contact-form__input"
                type="email"
                name="email"
                autocomplete="email"
                dir="ltr"
                required
              >
            </div>
          </div>

          <div class="contact-form__field">
            <label
              class="contact-form__label"
              for="contact-company"
            >
              {{ t('contact.company') }}
              <span class="contact-form__optional">{{ t('contact.optional') }}</span>
            </label>
            <input
              id="contact-company"
              class="contact-form__input"
              type="text"
              name="company"
              autocomplete="organization"
            >
          </div>

          <div class="contact-form__field">
            <label
              class="contact-form__label"
              for="contact-message"
            >{{ t('contact.message') }}</label>
            <textarea
              id="contact-message"
              class="contact-form__input contact-form__textarea"
              name="message"
              rows="4"
              required
            />
          </div>

          <div class="contact-form__foot">
            <BaseButton
              type="submit"
              variant="primary"
              :disabled="!endpoint || status === 'sending'"
            >
              {{ status === 'sending' ? t('contact.sending') : t('contact.send') }}
            </BaseButton>
          </div>

          <!--
            aria-live so the outcome is announced when it arrives: the
            reader who just pressed Send may have moved focus away, and a
            message that only appears visually tells them nothing.
          -->
          <p
            class="text-small contact-form__status"
            :class="`contact-form__status--${status}`"
            role="status"
            aria-live="polite"
          >
            <template v-if="status === 'sent'">
              {{ t('contact.success') }}
            </template>
            <template v-else-if="status === 'failed'">
              {{ t('contact.error', { email: content.email }) }}
            </template>
          </p>
        </form>
      </MotionReveal>
    </div>
  </section>
</template>

<style scoped>
/* ---------------------------------------------------------------------
   The split
--------------------------------------------------------------------- */

.contact {
  display: grid;
  grid-template-columns: minmax(0, 1fr);

  /*
    Where each panel's content starts, so the split can bleed to the
    viewport edges while its text still lines up with every other page's
    container. Below the container's max width the expression goes
    negative and max() falls back to the plain gutter.

    100% of this element, not 100vw: a viewport unit includes the
    scrollbar's width and would push the layout a few pixels wide.
  */
  --edge: max(var(--gutter), calc((100% - var(--container-max)) / 2 + var(--gutter)));
}

.contact__aside-inner,
.contact__main-inner {
  padding-block: clamp(var(--space-8), 7vw, var(--space-10));
  padding-inline: var(--gutter);
}

/* ---------------------------------------------------------------------
   Ink panel — statement and details
--------------------------------------------------------------------- */

.contact__eyebrow {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  color: var(--color-text-on-dark-muted);
}

/* The rule runs off the end of the eyebrow, drawn in CSS so the mark never
   reaches the accessibility tree. */
.contact__eyebrow::after {
  content: '';
  inline-size: 3rem;
  block-size: 1px;
  background: var(--color-text-on-dark-muted);
}

/* Shaped from the display token rather than taken from it: this panel is
   roughly two fifths of the page, and the token's ceiling broke a
   three-word title across four lines inside it. */
.contact__title {
  font-size: clamp(2.25rem, 1.6rem + 2.4vw, 3.5rem);
  color: var(--color-text-on-dark);
  margin-block: var(--space-4) var(--space-5);
}

.contact__intro {
  max-inline-size: 30rem;
  color: var(--color-text-on-dark-muted);
}

/* A silver rule opens the details, the same wordmark accent the story
   timeline and the chairman's quote use. */
.contact__details-heading {
  position: relative;
  margin-block-start: clamp(var(--space-8), 6vw, var(--space-9));
  padding-block-start: var(--space-5);
  color: var(--color-text-on-dark-muted);
}

.contact__details-heading::before {
  content: '';
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  inline-size: 3rem;
  block-size: 2px;
  background: var(--gradient-silver);
}

.contact__details {
  list-style: none;
  padding-inline-start: 0;
  margin-block-start: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Icon and value on one row, top-aligned so the multi-line address keeps
   its icon beside the first line rather than centred against the block. */
.contact__detail {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.contact__icon {
  flex: none;
  inline-size: 1.125rem;
  block-size: 1.125rem;
  /* Nudged down to the first text line's optical centre. */
  margin-block-start: 0.15rem;
  color: var(--color-text-on-dark-muted);
}

.contact__link {
  font-weight: 500;
  color: var(--color-text-on-dark);
  text-decoration: none;
}

.contact__link:hover {
  text-decoration: underline;
}

.contact__value {
  color: var(--color-text-on-dark-muted);
}

/* ---------------------------------------------------------------------
   White panel — the form
--------------------------------------------------------------------- */

.contact__main {
  background: var(--color-bg);
}

.contact__form-heading {
  margin-block-end: var(--space-3);
}

.contact__form-body {
  max-inline-size: 32rem;
  margin-block-end: clamp(var(--space-6), 4vw, var(--space-7));
}

.contact__notice {
  max-inline-size: 32rem;
  margin-block-end: var(--space-6);
  padding-inline-start: var(--space-4);
  border-inline-start: 2px solid var(--color-border-strong);
  color: var(--color-text-muted);
}

/* ---------------------------------------------------------------------
   Form — underline fields
--------------------------------------------------------------------- */

.contact-form {
  display: flex;
  flex-direction: column;
  gap: clamp(var(--space-5), 3vw, var(--space-6));
  max-inline-size: 34rem;
}

.contact-form__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(var(--space-5), 3vw, var(--space-6));
}

.contact-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-inline-size: 0;
}

.contact-form__label {
  font-size: var(--font-size-label);
  font-weight: 600;
  letter-spacing: var(--letter-spacing-label);
  text-transform: uppercase;
  color: var(--color-text-muted);
  transition: color var(--motion-duration-fast) var(--motion-ease);
}

html[dir="rtl"] .contact-form__label {
  letter-spacing: normal;
  text-transform: none;
}

.contact-form__optional {
  font-weight: 400;
  text-transform: none;
  letter-spacing: normal;
  color: var(--color-text-subtle);
}

/*
  A ruled line rather than a boxed input. Four framed rectangles stacked in
  a column were the heaviest thing on a page whose whole identity is thin
  rules and open space; a single underline per field keeps the form in that
  language and lets the type carry it.

  The active field takes a soft tint and a heavier dark rule, and its label
  darkens with it: three signals at once, none of which is colour alone.
  That replaces the site's boxed focus ring here — text fields match
  :focus-visible on a mouse click too, so the ring drew a hard black frame
  around every field anyone clicked, on top of the rule.

  The inline padding is there at rest as well, so the text does not jump
  sideways when the tint arrives, and the heavier rule is an inset shadow
  rather than a wider border, so the field does not grow by a pixel.
*/
.contact-form__input {
  inline-size: 100%;
  padding-block: var(--space-3);
  padding-inline: var(--space-3);
  font: inherit;
  font-size: var(--font-size-body-lg);
  color: var(--color-text);
  background: transparent;
  border: 0;
  border-block-end: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  transition:
    background-color var(--motion-duration-fast) var(--motion-ease),
    border-color var(--motion-duration-fast) var(--motion-ease),
    box-shadow var(--motion-duration-fast) var(--motion-ease);
}

.contact-form__input:hover {
  border-block-end-color: var(--color-text);
}

.contact-form__input:focus,
.contact-form__input:focus-visible {
  outline: none;
  background: var(--color-bg-alt);
  border-block-end-color: var(--color-text);
  box-shadow: inset 0 -2px 0 var(--color-text);
}

/* The label follows its field's focus, so the pair reads as one active
   unit — and it is a second, non-colour signal of where you are. */
.contact-form__field:focus-within .contact-form__label {
  color: var(--color-text);
}

.contact-form__textarea {
  resize: vertical;
  min-block-size: 6rem;
}

/* Off-screen rather than display: none — a few services and some bots read
   the computed style, and a field that is simply unreachable catches more
   than one that is obviously absent. aria-hidden and tabindex="-1" in the
   template keep it out of both the tab order and the accessibility tree. */
.contact-form__bot {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.contact-form__foot {
  display: flex;
  margin-block-start: var(--space-2);
}

/* Set off by a rule on the inline-start edge, so the outcome reads as a
   note about the form rather than as one more line of it. Out of the flow
   entirely while empty, so nothing reserves a blank line. */
.contact-form__status:empty {
  display: none;
}

.contact-form__status {
  color: var(--color-text);
  padding-inline-start: var(--space-4);
  border-inline-start: 2px solid var(--color-border-strong);
}

/* Success takes the full-strength rule; a failure keeps the quieter one,
   since the message itself carries the bad news and the address to fall
   back on. Neither relies on colour alone. */
.contact-form__status--sent {
  border-inline-start-color: var(--color-text);
}

/* ---------------------------------------------------------------------
   Breakpoints
--------------------------------------------------------------------- */

@media (min-width: 640px) {
  .contact-form__row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .contact {
    /* The form is the working half, so it takes the wider share. */
    grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
    align-items: stretch;
  }

  /* Each panel bleeds to its own outer edge while its content stops at the
     line every other page's container stops at. */
  .contact__aside-inner {
    padding-inline: var(--edge) clamp(var(--space-6), 4vw, var(--space-8));
  }

  .contact__main-inner {
    padding-inline: clamp(var(--space-6), 4vw, var(--space-8)) var(--edge);
  }
}
</style>
