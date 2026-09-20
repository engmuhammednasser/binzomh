<script setup lang="ts">
import type { AboutOverviewContent } from '~~/types/content'

defineProps<{ content: AboutOverviewContent }>()
</script>

<template>
  <section class="overview surface-alt">
    <BaseContainer class="stack-section overview__inner">
      <MotionReveal
        :delay="150"
        class="overview__visual"
      >
        <HomeEditorialVisual
          :variant="1"
          aspect="3 / 4"
        />
      </MotionReveal>

      <MotionReveal class="overview__text">
        <p class="text-label text-muted">
          {{ content.eyebrow }}
        </p>
        <h2 class="text-h1 overview__heading">
          {{ content.heading }}
        </h2>
        <p class="text-body-lg text-muted overview__body">
          {{ content.body }}
        </p>
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.overview__inner {
  display: flex;
  align-items: center;
  gap: clamp(var(--space-6), 5vw, var(--space-9));
}

.overview__visual {
  flex: 1 1 38%;
}

.overview__text {
  flex: 1 1 54%;
}

.overview__heading {
  margin-block: var(--space-4) var(--space-5);
}

.overview__body {
  max-inline-size: 34rem;
}

@media (max-width: 1023px) {
  .overview__inner {
    flex-direction: column;
    align-items: stretch;
  }

  .overview__visual {
    flex: none;
    inline-size: 100%;
    max-inline-size: 20rem;
    margin-inline: auto;
    margin-block-end: var(--space-6);
  }
}
</style>
