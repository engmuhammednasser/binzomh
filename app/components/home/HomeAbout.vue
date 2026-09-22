<script setup lang="ts">
import type { HomeAboutContent } from '~~/types/content'

defineProps<{ content: HomeAboutContent }>()
// Dynamic srcset bypasses Nuxt's build-time base-path prefixing (same
// reason as HomeHero.vue) — apply it explicitly. See shared/utils/asset-url.ts.
const assetUrl = useAssetUrl()
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
        <!--
          Real corporate photography, replacing the "photography" treatment
          placeholder EditorialVisual used to render here (see the note in
          EditorialVisual.vue — this was the one slot it named explicitly).
          Decorative: alt="" / aria-hidden, matching the placeholder's own
          accessibility treatment, since the heading and body copy right
          next to it already carry the section's meaning in real, visible
          text. AVIF/WebP + PNG fallback, 480w/960w generated from the
          supplied 1122x1402 source (public/images/home/about.png) — never
          upscaled. loading="lazy" (not eager like the Hero image) since
          this section sits below the fold.
        -->
        <div class="about__visual-frame">
          <picture>
            <source
              type="image/avif"
              :srcset="`${assetUrl('/images/home/about-480.avif')} 480w, ${assetUrl('/images/home/about-960.avif')} 960w`"
              sizes="(max-width: 1023px) 22rem, 480px"
            >
            <source
              type="image/webp"
              :srcset="`${assetUrl('/images/home/about-480.webp')} 480w, ${assetUrl('/images/home/about-960.webp')} 960w`"
              sizes="(max-width: 1023px) 22rem, 480px"
            >
            <img
              src="/images/home/about.png"
              width="1122"
              height="1402"
              alt=""
              aria-hidden="true"
              class="about__image"
              loading="lazy"
              decoding="async"
            >
          </picture>
        </div>
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

/* Same frame language as the Hero visual: a hairline edge and a soft
   lifted shadow, not a filled card. object-fit: contain plus the source's
   own 1122:1402 ratio keep the full shot visible with no cropping. */
.about__visual-frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1122 / 1402;
  border-radius: var(--radius-md);
  border: 1px solid rgb(17 17 17 / 0.06);
  box-shadow: 0 24px 48px -28px rgb(17 17 17 / 0.28);
}

.about__image {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
  background: var(--color-bg-raised);
  border-radius: var(--radius-md);
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
