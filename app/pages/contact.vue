<script setup lang="ts">
import { contactContent as contactEn } from '~~/content/en/contact'
import { contactContent as contactAr } from '~~/content/ar/contact'

const content = usePairedContent(contactEn, contactAr)
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
