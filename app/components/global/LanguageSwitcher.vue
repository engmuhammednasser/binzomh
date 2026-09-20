<script setup lang="ts">
import { LOCALE_META } from '~~/utils/locale-meta'

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
  <div class="language-switcher">
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
}

.language-switcher__link {
  font-size: var(--font-size-small);
  text-decoration: none;
  padding-inline: var(--space-2);
  padding-block: var(--space-1);
  border-radius: var(--radius-sm);
}

.language-switcher__link:hover {
  text-decoration: underline;
}

.language-switcher__link--disabled {
  color: var(--color-text-subtle);
  cursor: not-allowed;
}
</style>
