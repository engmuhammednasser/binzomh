<script setup lang="ts">
import type { HomeHeroContent } from '~~/types/content'

defineProps<{ content: HomeHeroContent }>()

const siteName = useSiteName()
</script>

<template>
  <section class="hero">
    <BaseContainer class="hero__inner">
      <div class="hero__text">
        <MotionReveal :delay="0">
          <p class="text-label text-muted hero__eyebrow">
            {{ content.eyebrow }}
          </p>
        </MotionReveal>

        <MotionReveal
          :delay="90"
          class="hero__headline-mask"
        >
          <h1 class="text-display hero__headline">
            {{ content.headline }}
          </h1>
        </MotionReveal>

        <MotionReveal :delay="220">
          <p class="text-body-lg text-muted hero__description">
            {{ content.description }}
          </p>
        </MotionReveal>

        <MotionReveal :delay="340">
          <div class="hero__actions">
            <BaseButton
              :to="content.primaryCta.to"
              variant="primary"
            >
              {{ content.primaryCta.label }}
            </BaseButton>
            <BaseButton
              v-if="content.secondaryCta"
              :to="content.secondaryCta.to"
              variant="secondary"
            >
              {{ content.secondaryCta.label }}
            </BaseButton>
          </div>
        </MotionReveal>
      </div>

      <MotionReveal
        :delay="180"
        class="hero__visual"
      >
        <img
          src="/images/home/hero.png"
          width="1672"
          height="941"
          :alt="siteName"
          class="hero__image"
          fetchpriority="high"
          decoding="async"
        >
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.hero {
  padding-block-start: clamp(var(--space-8), 8vw, var(--space-10));
  padding-block-end: var(--space-section);
}

/* Full-width composition: text first, then the supplied brand visual
   spanning the entire Hero section — not a side-by-side split. */
.hero__inner {
  display: flex;
  flex-direction: column;
  gap: clamp(var(--space-6), 5vw, var(--space-8));
}

.hero__text {
  max-inline-size: 42rem;
}

.hero__eyebrow {
  margin-block-end: var(--space-4);
}

/* Mask reveal for the headline: the block rises into view from behind an
   overflow-hidden window, rather than a per-line JS split — robust across
   arbitrary wrapping, viewport widths, and both writing directions. */
.hero__headline-mask {
  overflow: hidden;
}

.hero__headline {
  margin-block-end: var(--space-5);
  transition: transform var(--motion-duration-slow) var(--motion-ease);
}

.hero__headline-mask.is-pending .hero__headline {
  transform: translateY(35%);
}

.hero__description {
  max-inline-size: 34rem;
  margin-block-end: var(--space-6);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.hero__visual {
  inline-size: 100%;
}

.hero__image {
  inline-size: 100%;
  aspect-ratio: 1672 / 941;
  object-fit: cover;
  border-radius: var(--radius-md);
  transition: transform var(--motion-duration-slow) var(--motion-ease);
}

.hero__visual.is-pending .hero__image {
  transform: scale(1.05);
}
</style>
