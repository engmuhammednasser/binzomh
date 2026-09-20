<script setup lang="ts">
import type { AboutStoryContent } from '~~/types/content'

defineProps<{ content: AboutStoryContent }>()
</script>

<template>
  <section class="story">
    <BaseContainer
      content
      class="stack-section"
    >
      <MotionReveal class="story__head">
        <p class="text-label text-muted">
          {{ content.eyebrow }}
        </p>
        <h2 class="text-h1 story__heading">
          {{ content.heading }}
        </h2>
        <p class="text-body-lg text-muted story__intro">
          {{ content.intro }}
        </p>
      </MotionReveal>

      <ol class="story__timeline">
        <li
          v-for="(entry, index) in content.timeline"
          :key="entry.year"
          class="story__entry"
        >
          <MotionReveal :delay="index * 110">
            <span class="text-h3 story__year">{{ entry.year }}</span>
            <p class="text-body-lg text-muted story__description">
              {{ entry.description }}
            </p>
          </MotionReveal>
        </li>
      </ol>

      <MotionReveal :delay="content.timeline.length * 110">
        <p class="text-small text-muted story__disclaimer">
          {{ content.disclaimer }}
        </p>
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.story__head {
  margin-block-end: var(--space-8);
}

.story__heading {
  margin-block: var(--space-4) var(--space-5);
}

.story__timeline {
  position: relative;
  list-style: none;
  padding-inline-start: var(--space-7);
  margin-block: 0 var(--space-6);
}

.story__timeline::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  inset-block: 0.6rem;
  inline-size: 2px;
  background: var(--gradient-silver);
}

.story__entry {
  position: relative;
  padding-block-end: var(--space-8);
}

.story__entry:last-child {
  padding-block-end: 0;
}

.story__entry::before {
  content: '';
  position: absolute;
  inset-inline-start: calc(-1 * var(--space-7) - 3px);
  inset-block-start: 0.35rem;
  inline-size: 8px;
  block-size: 8px;
  border-radius: 50%;
  background: var(--color-bg-inverse);
}

.story__year {
  display: block;
  margin-block-end: var(--space-2);
}

.story__description {
  max-inline-size: 34rem;
}

.story__disclaimer {
  max-inline-size: 34rem;
}
</style>
