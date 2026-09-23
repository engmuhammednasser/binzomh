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
        <!--
          Owner-supplied brand visual (2026-09-23), replacing the abstract
          EditorialVisual placeholder. Conceptual architecture, not a
          documented Binzomah site, so it carries no facility claim — same
          footing as the page Hero. Decorative: the heading and body beside
          it already carry the section's meaning in real text.

          Its 1086x1448 source is exactly the 3/4 the placeholder declared,
          so the column's proportions are unchanged.
        -->
        <div class="overview__visual-frame media-frame">
          <img
            src="/images/about/overview.jpeg"
            width="1086"
            height="1448"
            alt=""
            class="overview__image"
            loading="lazy"
            decoding="async"
          >
        </div>
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

.overview__visual-frame {
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--color-bg-raised);
}

.overview__image {
  display: block;
  inline-size: 100%;
  block-size: auto;
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
