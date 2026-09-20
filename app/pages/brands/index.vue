<script setup lang="ts">
const { t } = useI18n()
usePageSeo(() => t('nav.brands'), () => t('common.comingSoon'))
</script>

<template>
  <BaseContainer
    content
    class="stack-section"
  >
    <MotionReveal>
      <h1 class="text-h1">
        {{ t('nav.brands') }}
      </h1>
      <p class="text-body-lg text-muted">
        {{ t('common.comingSoon') }}
      </p>
    </MotionReveal>
  </BaseContainer>
</template>
