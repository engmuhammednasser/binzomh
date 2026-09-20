<script setup lang="ts">
import type { HomeNetworkContent } from '~~/types/content'

defineProps<{ content: HomeNetworkContent }>()
</script>

<template>
  <section class="network surface-inverse">
    <BaseContainer class="stack-section">
      <MotionReveal class="network__head">
        <p class="text-label network__eyebrow">
          {{ content.eyebrow }}
        </p>
        <h2 class="text-h1 network__heading">
          {{ content.heading }}
        </h2>
        <p class="text-body-lg network__intro">
          {{ content.intro }}
        </p>
      </MotionReveal>

      <ul class="network__list">
        <li
          v-for="(channel, index) in content.channels"
          :key="channel"
          class="network__row"
        >
          <MotionReveal :delay="index * 80">
            <span class="text-label network__index">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="network__name">{{ channel }}</span>
          </MotionReveal>
        </li>
      </ul>

      <MotionReveal
        v-if="content.cta"
        :delay="content.channels.length * 80"
      >
        <BaseButton
          :to="content.cta.to"
          variant="secondary"
          class="network__cta"
        >
          {{ content.cta.label }}
        </BaseButton>
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.network__head {
  margin-block-end: var(--space-8);
}

.network__eyebrow {
  color: var(--color-text-on-dark-muted);
}

.network__heading {
  margin-block: var(--space-4);
  color: var(--color-text-on-dark);
}

.network__intro {
  max-inline-size: 34rem;
  color: var(--color-text-on-dark-muted);
}

.network__list {
  list-style: none;
  padding: 0;
  margin-block-end: var(--space-8);
  border-block-start: 1px solid var(--color-text-on-dark-muted);
}

.network__row {
  border-block-end: 1px solid var(--color-text-on-dark-muted);
}

.network__row :deep(.reveal) {
  display: flex;
  align-items: baseline;
  gap: var(--space-5);
  padding-block: var(--space-6);
}

.network__index {
  flex: 0 0 auto;
  color: var(--color-text-on-dark-muted);
}

.network__name {
  flex: 1 1 auto;
  /* Same overflow guard as .brands__name — several channel names are a
     single long word (e.g. المستشفيات) in a flex row at 320px. */
  font-size: clamp(1.375rem, 1rem + 4.5vw, var(--font-size-h1));
  font-weight: 600;
  line-height: 1.15;
  min-inline-size: 0;
  overflow-wrap: anywhere;
  color: var(--color-text-on-dark);
}

.network__cta {
  border-color: var(--color-text-on-dark-muted);
  color: var(--color-text-on-dark);
}

.network__cta:hover {
  border-color: var(--color-text-on-dark);
}
</style>
