<script setup lang="ts">
import type { HomePartnershipContent } from '~~/types/content'

defineProps<{ content: HomePartnershipContent }>()
</script>

<template>
  <section class="partnership">
    <BaseContainer class="partnership__inner">
      <MotionReveal class="partnership__text">
        <p
          v-if="content.eyebrow"
          class="text-label text-muted"
        >
          {{ content.eyebrow }}
        </p>
        <span
          class="partnership__accent"
          aria-hidden="true"
        />
        <h2 class="text-display partnership__heading">
          {{ content.heading }}
        </h2>
      </MotionReveal>

      <MotionReveal
        :delay="120"
        class="partnership__action"
      >
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
  padding-block: clamp(var(--space-9), 8vw, var(--space-10));
}

.partnership__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-7);
}

.partnership__text {
  flex: 1 1 auto;
}

.partnership__accent {
  display: block;
  inline-size: 3rem;
  block-size: 4px;
  margin-block: var(--space-4) var(--space-5);
  background: var(--gradient-silver);
  clip-path: polygon(0 100%, 25% 0, 100% 0, 100% 100%);
}

html[dir="rtl"] .partnership__accent {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 75% 100%);
}

.partnership__heading {
  max-inline-size: 32rem;
}

.partnership__action {
  flex: 0 0 auto;
}

@media (max-width: 767px) {
  .partnership__inner {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-6);
  }
}
</style>
