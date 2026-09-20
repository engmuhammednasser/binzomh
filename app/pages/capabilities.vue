<script setup lang="ts">
import { capabilitiesContent as capabilitiesEn } from '~~/content/en/capabilities'
import { capabilitiesContent as capabilitiesAr } from '~~/content/ar/capabilities'

const content = usePairedContent(capabilitiesEn, capabilitiesAr)
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
