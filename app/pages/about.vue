<script setup lang="ts">
import { aboutContent as aboutEn } from '~~/content/en/about'
import { aboutContent as aboutAr } from '~~/content/ar/about'

const content = usePairedContent(aboutEn, aboutAr)
usePageSeo(() => content.value.title, () => content.value.intro)
</script>

<template>
  <BaseContainer
    content
    class="stack-section"
  >
    <MotionReveal>
      <h1 class="text-h1">
        {{ content.title }}
      </h1>
      <p class="text-body-lg text-muted">
        {{ content.intro }}
      </p>
      <p class="text-small text-muted">
        {{ $t('common.comingSoon') }}
      </p>
    </MotionReveal>
  </BaseContainer>
</template>
