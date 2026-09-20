<script setup lang="ts">
import type { HomePartnershipContent } from '~~/types/content'

defineProps<{ content: HomePartnershipContent }>()
</script>

<template>
  <section class="partnership">
    <BaseContainer
      content
      class="partnership__inner"
    >
      <MotionReveal>
        <h2 class="text-display partnership__heading">
          {{ content.heading }}
        </h2>
        <span
          class="partnership__accent"
          aria-hidden="true"
        />
        <BaseButton
          :to="content.cta.to"
          variant="primary"
        >
          {{ content.cta.label }}
        </BaseButton>
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.partnership {
  padding-block: var(--space-section);
  text-align: center;
}

.partnership__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.partnership__heading {
  margin-block-end: var(--space-6);
}

.partnership__accent {
  display: block;
  inline-size: 4rem;
  block-size: 3px;
  margin-block-end: var(--space-7);
  background: var(--gradient-silver);
}
</style>
