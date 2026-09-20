<script setup lang="ts">
import type { CapabilitiesHeroContent } from '~~/types/content'

defineProps<{ content: CapabilitiesHeroContent }>()
</script>

<template>
  <section class="cap-hero">
    <BaseContainer class="cap-hero__inner">
      <div class="cap-hero__text">
        <MotionReveal :delay="0">
          <p class="text-label text-muted">
            {{ content.eyebrow }}
          </p>
        </MotionReveal>
        <MotionReveal :delay="90">
          <h1 class="text-display cap-hero__heading">
            {{ content.heading }}
          </h1>
        </MotionReveal>
        <MotionReveal :delay="200">
          <p class="text-body-lg text-muted cap-hero__intro">
            {{ content.intro }}
          </p>
        </MotionReveal>
      </div>

      <MotionReveal
        :delay="150"
        class="cap-hero__visual"
      >
        <HomeEditorialVisual aspect="4 / 3" />
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.cap-hero {
  padding-block-start: clamp(var(--space-8), 8vw, var(--space-10));
  padding-block-end: var(--space-section);
}

.cap-hero__inner {
  display: flex;
  align-items: center;
  gap: clamp(var(--space-6), 5vw, var(--space-9));
}

.cap-hero__text {
  flex: 1 1 58%;
}

.cap-hero__heading {
  margin-block: var(--space-4) var(--space-5);
}

.cap-hero__intro {
  max-inline-size: 34rem;
}

.cap-hero__visual {
  flex: 1 1 34%;
}

@media (max-width: 1023px) {
  .cap-hero__inner {
    flex-direction: column;
    align-items: stretch;
  }

  .cap-hero__visual {
    flex: none;
    order: -1;
    inline-size: 100%;
    max-inline-size: 20rem;
    margin-inline: auto;
    margin-block-end: var(--space-6);
  }
}
</style>
