<script setup lang="ts">
import '../../assets/admin-tokens.css'
import { siteImageSlots } from '~~/content/images'

definePageMeta({ layout: false })

useAdminMessages()

const { t, locale } = useI18n()
const localePath = useLocalePath()
// The homepage hero, from the site's image registry, so replacing that
// image updates the sign-in backdrop too.
const heroImage = siteImageSlots['home-hero'].image
const siteImage = useSiteImage()
const siteName = useSiteName()
const direction = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const year = new Date().getFullYear()

useHead({
  title: () => t('admin.login.heading'),
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const assistance = ref<'recovery' | 'support' | null>(null)

const assistanceMessage = computed(() => assistance.value ? t(`admin.login.${assistance.value}Note`) : '')

const { login } = useAdminSession()
const emailInput = useTemplateRef<HTMLInputElement>('emailInput')
const passwordInput = useTemplateRef<HTMLInputElement>('passwordInput')
const errorMessage = useTemplateRef<HTMLParagraphElement>('errorMessage')
const fieldErrors = reactive({ email: '', password: '' })
const busy = ref(false)
const error = ref('')
async function submit() {
  if (busy.value) return
  error.value = ''
  // Read the displayed values too: password managers may fill without Vue input events.
  email.value = (emailInput.value?.value ?? email.value).trim()
  password.value = passwordInput.value?.value ?? password.value
  fieldErrors.email = !email.value ? t('admin.login.emailRequired') : emailInput.value?.validity.typeMismatch ? t('admin.login.emailInvalid') : ''
  fieldErrors.password = password.value ? '' : t('admin.login.passwordRequired')
  if (fieldErrors.email || fieldErrors.password) {
    await nextTick()
    ;(fieldErrors.email ? emailInput.value : passwordInput.value)?.focus()
    return
  }
  busy.value = true
  try {
    await login(email.value, password.value)
    password.value = ''
    await navigateTo(localePath('/admin'))
  }
  catch (cause) {
    const status = (cause as { statusCode?: number }).statusCode
    error.value = t(status === 429 ? 'admin.live.rateLimited' : status === 401 || status === 422 ? 'admin.live.loginFailed' : 'admin.login.unavailable')
    await nextTick()
    errorMessage.value?.focus()
  }
  finally { busy.value = false }
}
</script>

<template>
  <main class="login">
    <picture
      v-if="heroImage"
      class="login__art"
      aria-hidden="true"
    >
      <source
        v-for="source in siteImage.sources(heroImage)"
        :key="source.type"
        :type="source.type"
        :srcset="source.srcset"
        sizes="100vw"
      >
      <img
        :src="siteImage.src(heroImage)"
        :width="heroImage.width"
        :height="heroImage.height"
        alt=""
        fetchpriority="high"
        decoding="async"
      >
    </picture>

    <div class="login__shell">
      <header class="login__header">
        <NuxtLink
          :to="localePath('/')"
          class="login__brand"
        >
          <BaseLogo
            variant="light"
            size="clamp(2rem, 3vw, 2.75rem)"
          />
        </NuxtLink>
        <div class="login__navigation">
          <span
            class="login__wordmark"
            :dir="direction"
          >{{ t('admin.login.workspaceLabel') }}</span>
          <LanguageSwitcher
            class="login__language"
            on-dark
          />
        </div>
      </header>

      <div class="login__body">
        <section
          class="login__card"
          :dir="direction"
          aria-labelledby="login-heading"
        >
          <p class="login__kicker">
            {{ t('admin.login.portal') }}
          </p>
          <h1
            id="login-heading"
            class="login__heading"
          >
            {{ t('admin.login.welcome') }}
          </h1>
          <p class="login__intro">
            {{ t('admin.login.intro') }}
          </p>

          <p
            v-if="error"
            id="login-error"
            ref="errorMessage"
            role="alert"
            tabindex="-1"
            class="login__error"
          >
            {{ error }}
          </p>
          <form
            class="login__form"
            novalidate
            :aria-busy="busy"
            @submit.prevent="submit"
          >
            <div class="login__field">
              <label
                for="login-email"
                class="login__label"
              >{{ t('admin.login.email') }}</label>
              <input
                id="login-email"
                ref="emailInput"
                v-model="email"
                type="email"
                inputmode="email"
                autocomplete="username"
                class="login__input"
                placeholder="name@binzomah.net"
                dir="ltr"
                required
                :aria-invalid="!!fieldErrors.email"
                :aria-describedby="fieldErrors.email ? 'login-email-error' : undefined"
                @input="fieldErrors.email = ''"
              >
              <p
                v-if="fieldErrors.email"
                id="login-email-error"
                class="login__error"
                role="alert"
              >
                {{ fieldErrors.email }}
              </p>
            </div>
            <div class="login__field">
              <label
                for="login-password"
                class="login__label"
              >{{ t('admin.login.password') }}</label>
              <div class="login__password-wrap">
                <input
                  id="login-password"
                  ref="passwordInput"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  class="login__input login__input--password"
                  :placeholder="t('admin.login.passwordPlaceholder')"
                  required
                  :aria-invalid="!!fieldErrors.password"
                  :aria-describedby="fieldErrors.password ? 'login-password-error' : undefined"
                  @input="fieldErrors.password = ''"
                >
                <button
                  type="button"
                  class="login__eye"
                  :aria-label="t(showPassword ? 'admin.login.hidePassword' : 'admin.login.showPassword')"
                  aria-controls="login-password"
                  @click="showPassword = !showPassword"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                    />
                    <path
                      v-if="showPassword"
                      d="m3 3 18 18"
                    />
                  </svg>
                </button>
              </div>
              <p
                v-if="fieldErrors.password"
                id="login-password-error"
                class="login__error"
                role="alert"
              >
                {{ fieldErrors.password }}
              </p>
            </div>
            <div class="login__options">
              <span class="login__preview">{{ t('admin.prototypeBadge') }}</span>
              <button
                type="button"
                class="login__text-button"
                @click="assistance = 'recovery'"
              >
                {{ t('admin.login.forgot') }}
              </button>
            </div>
            <button
              type="submit"
              class="login__submit"
              :disabled="busy"
              aria-describedby="login-note"
            >
              <span>{{ busy ? t('admin.login.signingIn') : t('admin.login.submit') }}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M19 12H5m7-7-7 7 7 7" />
              </svg>
            </button>
          </form>

          <p
            id="login-note"
            class="login__note"
          >
            {{ t('admin.login.note') }}
          </p>
          <p
            v-if="assistanceMessage"
            class="login__assistance"
            role="status"
          >
            {{ assistanceMessage }}
          </p>
          <div class="login__help">
            <span>{{ t('admin.login.needHelp') }}</span>
            <button
              type="button"
              class="login__text-button"
              @click="assistance = 'support'"
            >
              {{ t('admin.login.help') }}
            </button>
          </div>
        </section>

        <aside
          class="login__story"
          :dir="direction"
          aria-labelledby="login-story-heading"
        >
          <p class="login__kicker">
            {{ t('admin.login.storyKicker') }}
          </p>
          <h2
            id="login-story-heading"
            class="login__headline"
          >
            <span>{{ t('admin.login.storyFirst') }}</span>
            <span>{{ t('admin.login.storySecond') }}</span>
          </h2>
          <p class="login__description">
            {{ t('admin.login.storyDescription') }}
          </p>
        </aside>
      </div>

      <footer class="login__footer">
        <p>© {{ year }} {{ siteName }}</p>
        <span class="login__preview">{{ t('admin.login.designPreview') }}</span>
        <span
          class="login__wordmark"
          :dir="direction"
        >{{ t('admin.login.location') }}</span>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.login__error { margin: .5rem 0 0; color: var(--admin-error-text-strong); font-size: .875rem; line-height: 1.7; }
.login__input[aria-invalid="true"] { border-color: var(--admin-error-text-strong); }
.login {
  --login-surface: #1d2225;
  --login-field: #252a2d;
  --login-text: #f4f3ef;
  --login-muted: #c3c7c8;
  --login-border: #4b5155;
  --login-action: #e7e8e4;
  --login-page-padding-block: clamp(var(--space-5), 3vh, var(--space-7));

  position: relative;
  isolation: isolate;
  min-block-size: 100vh;
  min-block-size: 100svh;
  padding: var(--login-page-padding-block) clamp(var(--space-5), 3.5vw, var(--space-8));
  color: var(--login-text);
  background: var(--color-bg-inverse);
  color-scheme: dark;
}

.login__art,
.login::after {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.login__art img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  object-position: center;
  filter: saturate(0.32);
}

.login::after {
  content: "";
  background:
    linear-gradient(100deg, rgb(14 16 18 / 0.67), rgb(14 16 18 / 0.25) 50%, rgb(14 16 18 / 0.76)),
    linear-gradient(0deg, rgb(14 16 18 / 0.7), transparent 60%);
}

.login__shell {
  display: flex;
  flex-direction: column;
  gap: clamp(var(--space-5), 3vh, var(--space-6));
  max-inline-size: 1400px;
  min-block-size: calc(100svh - 2 * var(--login-page-padding-block));
  margin-inline: auto;
}

.login__header,
.login__navigation,
.login__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
}

.login__brand {
  flex: 0 0 auto;
}

.login__wordmark {
  font-size: var(--font-size-label);
}

.login__wordmark[dir="ltr"] {
  font-family: var(--font-family-base);
  letter-spacing: 0.1em;
}

.login__language {
  padding: 0;
  border-color: rgb(255 255 255 / 0.4);
  border-radius: 50%;
}

.login__language :deep(.language-switcher__link) {
  display: grid;
  place-items: center;
  min-inline-size: 44px;
  min-block-size: 44px;
  padding: 0;
  border-radius: inherit;
  font-size: var(--font-size-label);
}

.login__body {
  display: grid;
  grid-template-columns: minmax(0, 27rem) minmax(0, 1fr);
  grid-template-areas: "form story";
  align-items: center;
  gap: clamp(var(--space-7), 9vw, 10rem);
  direction: ltr;
  flex: 1;
}

.login__card {
  grid-area: form;
  min-inline-size: 0;
  padding: clamp(var(--space-5), 2.25vw, var(--space-6));
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: 1.125rem;
  background: var(--login-surface);
  box-shadow: 0 24px 64px rgb(0 0 0 / 0.2);
  text-align: start;
}

.login__kicker {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-block-end: var(--space-3);
  font-size: var(--font-size-small);
  color: var(--login-muted);
}

.login__kicker::before {
  content: "";
  inline-size: 1.25rem;
  block-size: 1px;
  background: currentColor;
}

.login__heading {
  margin-block-end: var(--space-2);
  font-size: clamp(1.75rem, 2.5vw, 2.125rem);
}

.login__intro {
  color: var(--login-muted);
  font-size: var(--font-size-small);
  line-height: 1.9;
}

.login__form {
  display: grid;
  gap: var(--space-4);
  margin-block-start: var(--space-5);
}

.login__field {
  display: grid;
  gap: var(--space-2);
  min-inline-size: 0;
}

.login__label {
  font-size: var(--font-size-small);
}

.login__input {
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 52px;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--login-border);
  border-radius: var(--radius-md);
  font: inherit;
  color: var(--login-text);
  background: var(--login-field);
  transition: border-color var(--motion-duration-fast) var(--motion-ease);
}

.login__input::placeholder {
  color: var(--login-muted);
  font-size: var(--font-size-small);
}

.login__input:focus-visible {
  border-color: var(--login-text);
}

.login :is(button, a, input):focus-visible,
.login__language :deep(a:focus-visible) {
  outline: 2px solid var(--login-text);
  outline-offset: 4px;
  box-shadow: none;
}

.login__password-wrap {
  position: relative;
}

/* Keep the card's direction so the eye's space matches its side; plaintext
   still shows a Latin password left to right in Arabic. */
.login__input--password {
  padding-inline-end: 3.5rem;
  unicode-bidi: plaintext;
}

.login__eye {
  position: absolute;
  inset-inline-end: 4px;
  inset-block-start: 4px;
  display: grid;
  place-items: center;
  inline-size: 44px;
  block-size: 44px;
  border-radius: var(--radius-sm);
  color: var(--login-muted);
}

.login__eye:hover {
  background: rgb(255 255 255 / 0.06);
  color: var(--login-text);
}

.login__eye svg,
.login__submit svg {
  inline-size: 20px;
  block-size: 20px;
  flex: 0 0 auto;
}

.login__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.login__text-button {
  min-block-size: 44px;
  padding: 0;
  font-size: var(--font-size-small);
  text-align: start;
}

.login__text-button:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.login__submit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  min-block-size: 54px;
  padding: var(--space-3) var(--space-5);
  border: 0;
  border-radius: var(--radius-md);
  background: var(--login-action);
  color: var(--login-surface);
  font-size: var(--font-size-small);
  font-weight: 700;
  text-align: start;
  transition:
    background-color var(--motion-duration-fast) var(--motion-ease),
    transform var(--motion-duration-fast) var(--motion-ease);
}

.login__card[dir="ltr"] .login__submit svg {
  transform: rotate(180deg);
}

.login__submit:hover {
  background: var(--login-text);
  transform: translateY(-2px);
}

.login__note {
  margin-block-start: var(--space-3);
  color: var(--login-muted);
  font-size: var(--font-size-small);
  line-height: 1.7;
}

.login__assistance {
  padding: var(--space-3);
  margin-block-start: var(--space-4);
  border-radius: var(--radius-sm);
  background: var(--login-field);
  font-size: var(--font-size-small);
}

.login__help {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-1) var(--space-2);
  padding-block-start: var(--space-3);
  margin-block-start: var(--space-4);
  border-block-start: 1px solid var(--login-border);
  font-size: var(--font-size-small);
  color: var(--login-muted);
}

.login__help button {
  color: var(--login-text);
  font-weight: 700;
}

.login__story {
  grid-area: story;
  min-inline-size: 0;
  padding-block-end: var(--space-9);
  text-align: start;
}

.login__headline {
  font-size: clamp(2.25rem, 4.1vw, 3.75rem);
  line-height: 1.5;
  font-weight: 700;
}

.login__headline span {
  display: block;
}

.login__description {
  max-inline-size: 26rem;
  margin-block-start: var(--space-5);
  color: var(--login-muted);
  font-size: var(--font-size-small);
  line-height: 1.9;
}

.login__footer {
  flex-wrap: wrap;
  padding-block-start: var(--space-4);
  border-block-start: 1px solid rgb(255 255 255 / 0.3);
  color: var(--login-muted);
  font-size: var(--font-size-label);
}

.login__preview {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--login-muted);
  font-size: var(--font-size-label);
}

.login__preview::before {
  content: "";
  inline-size: 4px;
  block-size: 4px;
  border-radius: 50%;
  background: currentColor;
}

@media (max-width: 1000px) {
  .login__body {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--space-7);
  }

  .login__headline {
    font-size: clamp(2rem, 4vw, 2.75rem);
  }
}

@media (max-width: 760px) {
  .login::after {
    background: linear-gradient(180deg, rgb(14 16 18 / 0.67), rgb(14 16 18 / 0.57) 40%, rgb(14 16 18 / 0.8));
  }

  .login__navigation .login__wordmark {
    display: none;
  }

  .login__body {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "story" "form";
    gap: var(--space-5);
    max-inline-size: 32rem;
    inline-size: 100%;
    margin-inline: auto;
  }

  .login__story {
    padding-block-end: 0;
  }

  .login__headline {
    font-size: clamp(1.75rem, 5vw, 2.5rem);
  }

  .login__description {
    display: none;
  }

  .login__card {
    padding: var(--space-5);
  }

  .login__form {
    margin-block-start: var(--space-5);
  }

  .login__footer {
    gap: var(--space-3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .login__submit,
  .login__input {
    transition: none;
  }

  .login__submit:hover {
    transform: none;
  }
}
</style>
