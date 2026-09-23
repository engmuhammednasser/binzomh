<script setup lang="ts">
import { LOCALE_META } from '~~/utils/locale-meta'

withDefaults(defineProps<{ onDark?: boolean }>(), { onDark: false })

const { t, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const options = computed(() =>
  LOCALE_META.map(meta => ({
    ...meta,
    path: switchLocalePath(meta.code),
    active: meta.code === locale.value,
  })),
)
</script>

<template>
  <div
    class="language-switcher"
    :class="{ 'language-switcher--on-dark': onDark }"
  >
    <template
      v-for="option in options"
      :key="option.code"
    >
      <!--
        "AR" / "EN" are shown, but the native name stays in the accessible
        name via the visually-hidden span rather than an aria-label: an
        aria-label would REPLACE the visible text, and an accessible name
        that no longer contains the visible label breaks WCAG 2.5.3 for
        anyone driving the page by voice ("click AR"). Concatenated text
        keeps both — "AR العربية" — and lang= on the span lets a screen
        reader pronounce the name in the right language.
      -->
      <NuxtLink
        v-if="!option.active && option.path"
        :to="option.path"
        class="language-switcher__link"
        :hreflang="option.code"
      >
        {{ option.shortLabel }}
        <span
          class="visually-hidden"
          :lang="option.code"
        >{{ option.nativeName }}</span>
      </NuxtLink>
      <span
        v-else-if="!option.active"
        class="language-switcher__link language-switcher__link--disabled"
        :title="t('language.notAvailable', { language: option.nativeName })"
        aria-disabled="true"
      >
        {{ option.shortLabel }}
        <span
          class="visually-hidden"
          :lang="option.code"
        >{{ option.nativeName }}</span>
      </span>
    </template>
  </div>
</template>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

/* Tracked like the site's other short uppercase labels — at two glyphs a
   code reads as a cramped pair without it. Unconditional, unlike the
   .text-label utility that drops tracking under [dir="rtl"]: this label is
   Latin in both locales, so there is no Arabic letterform to protect. */
.language-switcher__link {
  font-size: var(--font-size-label);
  font-weight: 600;
  letter-spacing: var(--letter-spacing-label);
  text-decoration: none;
  padding-inline: var(--space-3);
  padding-block: var(--space-1);
  border-radius: var(--radius-sm);
  transition: background-color var(--motion-duration-fast) var(--motion-ease);
}

.language-switcher__link:hover {
  background: var(--color-bg-alt);
}

.language-switcher__link--disabled {
  color: var(--color-text-subtle);
  cursor: not-allowed;
}

.language-switcher--on-dark {
  border-color: var(--color-text-on-dark-muted);
}

.language-switcher--on-dark .language-switcher__link:hover {
  background: rgb(255 255 255 / 0.08);
}

.language-switcher--on-dark .language-switcher__link--disabled {
  color: var(--color-text-on-dark-muted);
}
</style>
