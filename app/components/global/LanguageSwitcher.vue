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
      <NuxtLink
        v-if="!option.active && option.path"
        :to="option.path"
        class="language-switcher__link"
        :hreflang="option.code"
      >
        {{ option.nativeName }}
      </NuxtLink>
      <span
        v-else-if="!option.active"
        class="language-switcher__link language-switcher__link--disabled"
        :title="t('language.notAvailable', { language: option.nativeName })"
        aria-disabled="true"
      >
        {{ option.nativeName }}
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

.language-switcher__link {
  font-size: var(--font-size-small);
  font-weight: 500;
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
