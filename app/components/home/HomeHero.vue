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
        <!--
          Responsive Hero delivery (native <picture>, no @nuxt/image):
          - AVIF, then WebP, then the original PNG as a universal fallback.
          - 960w/1440w are real derivatives generated from the existing
            1672x941 source (public/images/home/hero.png) — never upscaled.
          - A 1920w tier is intentionally NOT listed yet: it would need to be
            generated from a genuine ~1920x1080 master, which hasn't been
            supplied. Add hero-1920.avif/.webp + a "1920w" entry to both
            srcset lists above once that master lands.
          - `sizes` mirrors the actual layout math: full-bleed minus the
            fluid --gutter while the hero stacks (<=1023px, see the
            max-width: 1023px rule below), then the ~648px the visual
            column settles at in the desktop 43/57 split (see the
            min-width: 1024px rule).
        -->
        <div class="hero__visual-frame">
          <picture>
            <!--
              :srcset (bound) rather than a static srcset attribute: Vue's
              SFC compiler auto-converts a *static* srcset on <source> into
              a build-time JS import per URL, which Vite then resolves
              against the project root instead of /public — breaking any
              public-folder asset referenced this way. Binding it as a
              plain string sidesteps that transform; img[src] below is
              unaffected by the bug and was already left alone by the
              compiler.
            -->
            <source
              type="image/avif"
              :srcset="'/images/home/hero-960.avif 960w, /images/home/hero-1440.avif 1440w'"
              sizes="(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 3.25rem), 648px"
            >
            <source
              type="image/webp"
              :srcset="'/images/home/hero-960.webp 960w, /images/home/hero-1440.webp 1440w'"
              sizes="(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 3.25rem), 648px"
            >
            <img
              src="/images/home/hero.png"
              width="1672"
              height="941"
              :alt="siteName"
              class="hero__image"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            >
          </picture>
        </div>
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
/* Tighter than the shared --space-section rhythm used elsewhere on the
   page: the hero sits directly under the header with nothing above it,
   and unlike a mid-page section it doesn't need a full section's worth
   of air on either side — this is a local override, not a change to the
   shared token, so every other section keeps its normal spacing. */
.hero {
  padding-block-start: clamp(var(--space-6), 6vw, var(--space-8));
  padding-block-end: clamp(var(--space-6), 5vw, var(--space-8));
}

/* Mirrors under RTL like every other section on the site (About,
   Capabilities, ...) — text first in reading order, image second, so in
   Arabic the text column sits on the right and the visual on the left.
   This used to be pinned to a fixed physical left/right in both
   languages, on the assumption the image had a literal wordmark baked in
   that wouldn't flip correctly; the actual asset (public/images/home/
   hero.png) turned out to carry only an abstract geometric "Z"-ribbon
   shape, not literal text, so there's nothing in it with a "wrong"
   reading direction — ordinary mirroring applies cleanly.

   The split is deliberately image-led rather than an even 50/50 — see
   the min-width: 1024px block below, where the desktop column ratio,
   headline scale and column gap are all tuned together so the hero visual
   reads as the section's primary brand statement instead of a supporting
   illustration next to the copy, and reads as a large media panel rather
   than a bordered card next to it. */
.hero__inner {
  display: flex;
  align-items: center;
  gap: clamp(var(--space-6), 5vw, var(--space-9));
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
  margin-block-end: var(--space-4);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

/* The visual's frame, softened: a hairline edge and a soft lifted shadow
   define the panel instead of a filled "mat" border around it — the
   previous padded, flat-background card read as a placed object next to
   the copy rather than a hero asset in its own right. The image now runs
   edge-to-edge inside the frame; the fixed aspect-ratio plus
   object-fit: contain still guarantee the full composition is always
   visible and never cropped, even if a future master image doesn't share
   the source's exact 1672:941 ratio — it would simply letterbox within
   this same panel (the img's own background covers that rare case)
   rather than lose part of the shot. */
.hero__visual-frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1672 / 941;
  border-radius: var(--radius-md);
  border: 1px solid rgb(17 17 17 / 0.06);
  box-shadow: 0 24px 48px -28px rgb(17 17 17 / 0.28);
}

.hero__image {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
  background: var(--color-bg-raised);
  border-radius: var(--radius-md);
  transition: transform var(--motion-duration-slow) var(--motion-ease);
}

.hero__visual.is-pending .hero__image {
  transform: scale(1.02);
}

/* ------------------------------------------------------------------
   Desktop (>=1024px) redesign: the visual column takes clearly more
   width than the text column (57/43), the column gap tightens further
   to give that extra width somewhere to come from, and the headline is
   capped narrower, scaled down another step, and pulled tighter to the
   description so the whole text block reads as a compact, confident
   block rather than the section's dominant element. None of this
   applies below 1024px — see the max-width: 1023px stack underneath
   instead, which is unchanged from before this redesign.
------------------------------------------------------------------ */
@media (min-width: 1024px) {
  .hero__inner {
    gap: clamp(var(--space-5), 3vw, var(--space-7));
  }

  .hero__text {
    flex: 1 1 43%;
  }

  /* No max-inline-size here on purpose: a fixed rem cap doesn't scale with
     the viewport the way the font-size clamp above it does, so on a wide
     screen the text kept growing while the box didn't — cramming bigger
     text into the same narrow column fractured it into short, ragged
     lines with a large unused gutter next to them. Letting it use the
     full ~43% column (which itself scales with the viewport) keeps the
     wrap pattern proportionate at every desktop width instead of just
     the one it was tuned against. */
  .hero__headline {
    margin-block-end: var(--space-4);
    font-size: clamp(1.75rem, 1.1rem + 1.6vw, 3rem);
  }

  .hero__description {
    max-inline-size: 27rem;
  }

  .hero__visual {
    flex: 1 1 57%;
  }
}

/* Below this, the two columns stack — "fixed right/left" is a desktop
   concept only; once stacked there's no left/right to fix. */
@media (max-width: 1023px) {
  .hero__inner {
    flex-direction: column;
    align-items: stretch;
  }

  .hero__text,
  .hero__visual {
    flex: none;
    inline-size: 100%;
  }
}
</style>
