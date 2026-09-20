<script setup lang="ts">
import type { HomeAboutContent } from '~~/types/content'

defineProps<{ content: HomeAboutContent }>()
</script>

<template>
  <section class="about">
    <BaseContainer class="about__inner">
      <MotionReveal class="about__text">
        <p class="text-label text-muted">
          {{ content.eyebrow }}
        </p>
        <h2 class="text-h1 about__heading">
          {{ content.heading }}
        </h2>
        <p class="text-body-lg text-muted about__body">
          {{ content.body }}
        </p>

        <ul class="about__points">
          <li
            v-for="point in content.points"
            :key="point"
            class="text-small about__point"
          >
            {{ point }}
          </li>
        </ul>

        <BaseButton
          v-if="content.cta"
          :to="content.cta.to"
          variant="secondary"
        >
          {{ content.cta.label }}
        </BaseButton>
      </MotionReveal>

      <MotionReveal
        :delay="150"
        class="about__visual"
      >
        <HomeEditorialVisual aspect="3 / 4" />
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.about {
  padding-block: var(--space-section);
}

.about__inner {
  display: flex;
  align-items: center;
  gap: clamp(var(--space-6), 5vw, var(--space-9));
}

.about__text {
  flex: 1 1 52%;
}

.about__heading {
  margin-block: var(--space-4);
}

.about__body {
  max-inline-size: 34rem;
  margin-block-end: var(--space-5);
}

.about__points {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  list-style: none;
  padding: 0;
  margin-block-end: var(--space-6);
}

.about__point {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
}

.about__visual {
  flex: 1 1 40%;
}

/* Editorial asymmetry: the visual sits offset from the text baseline
   instead of aligning to a plain 50/50 grid. */
@media (min-width: 1280px) {
  .about__visual {
    margin-block-start: var(--space-9);
  }
}

@media (max-width: 1023px) {
  .about__inner {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .about__visual {
    flex: none;
    inline-size: 100%;
    max-inline-size: 22rem;
    margin-inline: auto;
    margin-block: 0 var(--space-6);
  }
}
</style>
