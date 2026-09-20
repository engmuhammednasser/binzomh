<script setup lang="ts">
// No brand roster is approved yet (see content/brands/README.md), so every
// slug currently renders the same "not yet available" state rather than
// fabricating brand content.
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
