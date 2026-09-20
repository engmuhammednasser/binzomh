<script setup lang="ts">
import { homeContent as homeEn } from '~~/content/en/home'
import { homeContent as homeAr } from '~~/content/ar/home'

const content = usePairedContent(homeEn, homeAr)
usePageSeo(() => content.value.title, () => content.value.intro)
// The home title already is the brand name — skip the global "· Binzomah
// Cosmetics" suffix here so it doesn't repeat.
useHead({ titleTemplate: '%s' })
</script>

<template>
  <div class="page-home">
    <BaseContainer class="stack-section">
      <MotionReveal>
        <p class="text-label text-muted">
          {{ $t('nav.home') }}
        </p>
        <h1 class="text-display">
          {{ content.title }}
        </h1>
        <p class="text-body-lg text-muted">
          {{ content.intro }}
        </p>
        <BaseButton
          v-if="content.primaryCta"
          :to="content.primaryCta.to"
          variant="primary"
        >
          {{ content.primaryCta.label }}
        </BaseButton>
      </MotionReveal>
    </BaseContainer>
  </div>
</template>
