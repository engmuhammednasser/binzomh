<script setup lang="ts">
import type { AboutStrategiesContent } from '~~/types/content'

defineProps<{ content: AboutStrategiesContent }>()
</script>

<template>
  <section class="strategies">
    <BaseContainer class="stack-section">
      <MotionReveal class="strategies__head">
        <p class="text-label text-muted">
          {{ content.eyebrow }}
        </p>
        <h2 class="text-h1 strategies__heading">
          {{ content.heading }}
        </h2>
      </MotionReveal>

      <ul class="strategies__grid">
        <li
          v-for="(item, index) in content.items"
          :key="item.number"
          class="strategy"
        >
          <MotionReveal :delay="index * 90">
            <span class="text-label text-muted strategy__number">{{ item.number }}</span>
            <h3 class="text-h3 strategy__title">
              {{ item.title }}
            </h3>
            <p class="text-body-lg text-muted strategy__description">
              {{ item.description }}
            </p>
          </MotionReveal>
        </li>
      </ul>
    </BaseContainer>
  </section>
</template>

<style scoped>
.strategies__head {
  margin-block-end: var(--space-8);
}

.strategies__heading {
  margin-block-start: var(--space-4);
}

.strategies__grid {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-8) clamp(var(--space-6), 5vw, var(--space-9));
}

.strategy {
  padding-block-start: var(--space-5);
  border-block-start: 1px solid var(--color-border);
}

.strategy__title {
  margin-block: var(--space-3) var(--space-3);
}

.strategy__description {
  max-inline-size: 30rem;
}

@media (max-width: 767px) {
  .strategies__grid {
    grid-template-columns: 1fr;
  }
}
</style>
