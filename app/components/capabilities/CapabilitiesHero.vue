<script setup lang="ts">
import type { CapabilitiesHeroContent } from '~~/types/content'
import { frameAspect } from '~~/shared/utils/site-image'

const { slotFor } = useManagedSite()

defineProps<{ content: CapabilitiesHeroContent }>()

// The file, its size and its alt come from the image registry
// (content/images.ts); only the layout-dependent attributes — sizes,
// loading priority — stay in this template.
const slot = computed(() => slotFor('capabilities-hero')!)
const image = computed(() => slot.value.image)
// With no image chosen for the slot, the design placeholder fills the
// same frame (see content/images.ts).
const siteImage = useSiteImage()
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
        <div class="cap-hero__visual-frame media-frame">
          <picture v-if="image">
            <source
              v-for="source in siteImage.sources(image)"
              :key="source.type"
              :type="source.type"
              :srcset="source.srcset"
              sizes="(max-width: 1023px) 20rem, 34vw"
            >
            <img
              :src="siteImage.src(image)"
              :width="image.width"
              :height="image.height"
              :alt="siteImage.alt(image)"
              aria-hidden="true"
              class="cap-hero__visual-image"
              loading="lazy"
              decoding="async"
            >
          </picture>
          <HomeEditorialVisual
            v-else
            treatment="photography"
            :aspect="frameAspect(slot.frame)"
          />
        </div>
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

/* Same frame language as the homepage Capabilities/About visuals: a
   hairline edge and a soft lifted shadow, sized to the source photo's own
   1122:1402 ratio. Reuses the lead "Brand Partnerships" photo since the
   hero doesn't map to one of the three capability items. */
.cap-hero__visual-frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1122 / 1402;
  border-radius: var(--radius-md);
  border: 1px solid rgb(17 17 17 / 0.06);
  box-shadow: 0 24px 48px -28px rgb(17 17 17 / 0.28);
}

.cap-hero__visual-image {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
  background: var(--color-bg-raised);
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
