<script setup lang="ts">
import type { CapabilitiesSectionItem } from '~~/types/content'

defineProps<{ item: CapabilitiesSectionItem, index: number }>()
</script>

<template>
  <section
    class="cap-section"
    :class="{ 'is-alt': index % 2 === 1 }"
  >
    <BaseContainer class="stack-section cap-section__inner">
      <MotionReveal class="cap-section__visual-wrap">
        <div class="cap-section__sticky">
          <span
            class="text-display cap-section__number"
            aria-hidden="true"
          >{{ item.number }}</span>
          <HomeEditorialVisual
            :variant="index"
            aspect="4 / 3"
          />
        </div>
      </MotionReveal>

      <MotionReveal
        :delay="120"
        class="cap-section__text"
      >
        <h2 class="text-h1 cap-section__title">
          {{ item.title }}
        </h2>
        <p class="text-body-lg cap-section__summary">
          {{ item.summary }}
        </p>
        <p class="text-body-lg text-muted cap-section__body">
          {{ item.body }}
        </p>
        <BaseButton
          v-if="item.cta"
          :to="item.cta.to"
          variant="secondary"
        >
          {{ item.cta.label }}
        </BaseButton>
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.cap-section__inner {
  display: flex;
  align-items: flex-start;
  gap: clamp(var(--space-6), 5vw, var(--space-9));
}

.cap-section.is-alt .cap-section__inner {
  /* Alternates the visual/text side per section, regardless of writing
     direction — row-reverse always flips relative to whatever "row"
     currently means, so the zig-zag stays consistent in both LTR and RTL. */
  flex-direction: row-reverse;
}

.cap-section__visual-wrap {
  flex: 1 1 42%;
}

.cap-section__sticky {
  position: sticky;
  inset-block-start: calc(var(--space-8) + var(--space-2));
}

.cap-section__number {
  display: block;
  margin-block-end: var(--space-4);
  color: var(--color-border-strong);
  line-height: 1;
}

.cap-section__text {
  flex: 1 1 50%;
  padding-block-start: var(--space-4);
}

.cap-section__title {
  margin-block-end: var(--space-4);
}

.cap-section__summary {
  margin-block-end: var(--space-4);
  max-inline-size: 32rem;
}

.cap-section__body {
  max-inline-size: 32rem;
  margin-block-end: var(--space-6);
}

@media (max-width: 1023px) {
  .cap-section__inner,
  .cap-section.is-alt .cap-section__inner {
    flex-direction: column;
  }

  .cap-section__sticky {
    position: static;
  }

  .cap-section__visual-wrap {
    order: -1;
    inline-size: 100%;
    max-inline-size: 22rem;
    margin-inline: auto;
    margin-block-end: var(--space-6);
  }
}
</style>
