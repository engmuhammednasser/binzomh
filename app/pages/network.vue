<script setup lang="ts">
import { networkContent as networkEn } from '~~/content/en/network'
import { networkContent as networkAr } from '~~/content/ar/network'

const content = usePairedContent(networkEn, networkAr)
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
