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
        <h2 class="text-h2 partnership__heading">
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
  padding-block: clamp(var(--space-8), 6vw, var(--space-9));
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
  margin-block: var(--space-3) var(--space-4);
  background: var(--gradient-silver);
  clip-path: polygon(0 100%, 25% 0, 100% 0, 100% 100%);
}

html[dir="rtl"] .partnership__accent {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 75% 100%);
}

/* A wider measure keeps the closing question compact at the h2 scale. */
.partnership__heading {
  max-inline-size: 38rem;
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
