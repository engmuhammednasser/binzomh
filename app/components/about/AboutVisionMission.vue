<script setup lang="ts">
import type { AboutVisionMissionContent } from '~~/types/content'

defineProps<{ content: AboutVisionMissionContent }>()
</script>

<template>
  <section class="vm surface-inverse">
    <BaseContainer class="stack-section">
      <MotionReveal class="vm__head">
        <p class="text-label vm__eyebrow">
          {{ content.eyebrow }}
        </p>
        <h2 class="text-h1 vm__heading">
          {{ content.heading }}
        </h2>
      </MotionReveal>

      <div class="vm__grid">
        <MotionReveal
          :delay="0"
          class="vm__item"
        >
          <span class="text-label vm__label">{{ content.visionLabel }}</span>
          <p class="text-h3 vm__quote">
            {{ content.vision }}
          </p>
        </MotionReveal>
        <MotionReveal
          :delay="120"
          class="vm__item"
        >
          <span class="text-label vm__label">{{ content.missionLabel }}</span>
          <p class="text-h3 vm__quote">
            {{ content.mission }}
          </p>
        </MotionReveal>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.vm__head {
  margin-block-end: var(--space-8);
}

.vm__eyebrow {
  color: var(--color-text-on-dark-muted);
}

.vm__heading {
  margin-block-start: var(--space-4);
  color: var(--color-text-on-dark);
}

.vm__grid {
  display: flex;
  gap: clamp(var(--space-6), 5vw, var(--space-9));
}

.vm__item {
  flex: 1 1 50%;
  padding-inline-start: var(--space-5);
  border-inline-start: 2px solid var(--color-text-on-dark-muted);
}

.vm__label {
  display: block;
  margin-block-end: var(--space-4);
  color: var(--color-text-on-dark-muted);
}

.vm__quote {
  color: var(--color-text-on-dark);
  font-weight: 500;
  line-height: 1.4;
}

@media (max-width: 767px) {
  .vm__grid {
    flex-direction: column;
    gap: var(--space-6);
  }
}
</style>
