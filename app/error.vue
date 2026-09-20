<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()
const localeHead = useLocaleHead()
useHead({
  htmlAttrs: {
    lang: () => localeHead.value.htmlAttrs.lang,
    dir: () => localeHead.value.htmlAttrs.dir,
  },
})

function goHome() {
  clearError({ redirect: localePath('/') })
}
</script>

<template>
  <div class="error-page">
    <BaseContainer
      content
      class="error-page__inner"
    >
      <p class="text-label text-muted">
        {{ error.statusCode }}
      </p>
      <h1 class="text-h2">
        {{ t('notFound.title') }}
      </h1>
      <p class="text-body-lg text-muted">
        {{ t('notFound.body') }}
      </p>
      <BaseButton
        variant="primary"
        @click="goHome"
      >
        {{ t('notFound.backHome') }}
      </BaseButton>
    </BaseContainer>
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  min-block-size: 100vh;
}

.error-page__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: flex-start;
}
</style>
