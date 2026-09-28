<script setup lang="ts">
import type { BrandProfile, BrandsPageContent } from '~~/types/brands'

defineProps<{ brands: BrandProfile[], content: BrandsPageContent }>()

const localePath = useLocalePath()
// Dynamic src bypasses Nuxt's build-time base-path prefixing (same reason as
// HomeHero.vue / HomeBrands.vue) — apply it explicitly. See
// shared/utils/asset-url.ts.
const assetUrl = useAssetUrl()
</script>

<template>
  <div class="brand-portfolio">
    <!--
      Built to the homepage's own patterns rather than to this page's
      former ones: an image-led hero with the headline rising out of a
      mask, a card grid for the roster, and a closing statement on the
      inverse surface. Section rhythm matches the homepage too —
      hero (base) → roster (alt) → closing (inverse).
    -->
    <section class="portfolio-hero">
      <BaseContainer class="portfolio-hero__inner">
        <div class="portfolio-hero__text">
          <MotionReveal :delay="0">
            <p class="text-label text-muted portfolio-hero__eyebrow">
              {{ content.eyebrow }}
            </p>
          </MotionReveal>

          <!--
            The same mask reveal the homepage headline uses: the block
            rises into view from behind an overflow-hidden window, rather
            than a per-line JS split — robust across arbitrary wrapping,
            viewport widths, and both writing directions.
          -->
          <MotionReveal
            :delay="90"
            class="portfolio-hero__headline-mask"
          >
            <h1 class="text-display portfolio-hero__headline">
              {{ content.title }}
            </h1>
          </MotionReveal>

          <MotionReveal :delay="220">
            <p class="text-body-lg text-muted portfolio-hero__intro">
              {{ content.intro }}
            </p>
          </MotionReveal>
        </div>

        <MotionReveal
          :delay="180"
          class="portfolio-hero__visual"
        >
          <!--
            Owner-supplied brand visual (2026-09-27), replacing the
            EditorialVisual placeholder this hero opened with. Unbranded
            vessels in the house palette — a conceptual still life, not a
            photograph of any product Binzomah distributes, so it makes no
            claim about the portfolio below it. Decorative: the headline
            and intro beside it carry the section's meaning in real text.

            Its 1672x941 source is the same 16:9 the homepage hero uses, so
            the two pages open on identically proportioned media.

            eager + fetchpriority="high": this is above the fold and is the
            page's largest contentful paint candidate. No <picture> sources
            yet — AVIF/WebP derivatives have not been generated; see item 3.
          -->
          <div class="portfolio-hero__visual-frame media-frame">
            <img
              src="/images/brands/hero.jpeg"
              width="1672"
              height="941"
              alt=""
              class="portfolio-hero__image"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            >
          </div>
        </MotionReveal>
      </BaseContainer>
    </section>

    <section class="portfolio-roster surface-alt">
      <BaseContainer class="stack-section">
        <MotionReveal>
          <p class="text-small text-muted portfolio-roster__notice">
            {{ content.rosterNotice }}
          </p>
        </MotionReveal>

        <!--
          A card grid on the homepage's model, in place of the stacked
          roster rows this page used to carry. The cards are richer than
          the homepage teaser's, because this is the page the teaser links
          to: each one names its brand and states its action rather than
          leaving the logo to do both jobs alone.
        -->
        <ol class="portfolio-roster__grid">
          <li
            v-for="(brand, index) in brands"
            :key="brand.slug"
            class="portfolio-roster__item"
          >
            <MotionReveal :delay="index * 90">
              <NuxtLink
                :to="localePath(`/brands/${brand.slug}`)"
                :aria-label="`${content.viewBrand} ${brand.name}`"
                class="portfolio-roster__card"
              >
                <!--
                  The approved production logos, extended to this page by
                  the owner on 2026-09-24 (item 1) — the same three files
                  the homepage teaser uses, unedited.

                  alt="" and aria-hidden: the brand's name sits under the
                  mark in real text and the link already carries its own
                  label, so naming the image too would have a screen reader
                  read the same brand three times per card.

                  object-fit: contain inside a fixed tile — the files carry
                  their own opaque backgrounds and range from 630x630 to
                  1365x667, so a shared frame normalises them instead of
                  stretching the artwork.
                -->
                <span
                  v-if="brand.logo"
                  class="portfolio-roster__logo"
                >
                  <img
                    :src="assetUrl(brand.logo.src)"
                    :width="brand.logo.width"
                    :height="brand.logo.height"
                    alt=""
                    aria-hidden="true"
                    class="portfolio-roster__logo-img"
                    loading="lazy"
                    decoding="async"
                  >
                </span>
                <!-- Fallback for a future roster entry that ships before
                     its own logo clears approval — see the optional
                     BrandLogo field in types/brands.ts. -->
                <span
                  v-else
                  class="portfolio-roster__logo portfolio-roster__logo--empty"
                  aria-hidden="true"
                />

                <span class="portfolio-roster__body">
                  <h2 class="text-h4 portfolio-roster__name"><bdi>{{ brand.name }}</bdi></h2>
                  <span class="text-small portfolio-roster__action">
                    {{ content.viewBrand }}
                    <span
                      class="portfolio-roster__arrow"
                      aria-hidden="true"
                    >↗</span>
                  </span>
                </span>
              </NuxtLink>
            </MotionReveal>
          </li>
        </ol>
      </BaseContainer>
    </section>

    <!--
      Closing in the shape the homepage's partnership block established: a
      statement at heading scale with the action beside it, on the inverse
      surface.
    -->
    <section class="portfolio-enquiry surface-inverse">
      <BaseContainer class="portfolio-enquiry__inner">
        <MotionReveal class="portfolio-enquiry__text">
          <h2 class="text-h1 portfolio-enquiry__heading">
            {{ content.enquiryHeading }}
          </h2>
          <p class="text-body-lg portfolio-enquiry__body">
            {{ content.enquiryBody }}
          </p>
        </MotionReveal>
        <MotionReveal
          :delay="120"
          class="portfolio-enquiry__action"
        >
          <BaseButton
            :to="content.enquiryCta.to"
            variant="primary"
          >
            {{ content.enquiryCta.label }}
          </BaseButton>
        </MotionReveal>
      </BaseContainer>
    </section>
  </div>
</template>

<style scoped>
/* ---------------------------------------------------------------------
   Hero — the homepage hero's proportions and motion
--------------------------------------------------------------------- */

/* Tighter than the shared --space-section rhythm: the hero sits directly
   under the header with nothing above it, so it needs less air than a
   mid-page section. A local override, not a change to the token. */
.portfolio-hero {
  padding-block-start: clamp(var(--space-6), 6vw, var(--space-8));
  padding-block-end: clamp(var(--space-6), 5vw, var(--space-8));
}

.portfolio-hero__inner {
  display: flex;
  align-items: center;
  gap: clamp(var(--space-6), 5vw, var(--space-9));
}

.portfolio-hero__eyebrow {
  margin-block-end: var(--space-4);
}

.portfolio-hero__headline-mask {
  overflow: hidden;
}

.portfolio-hero__headline {
  margin-block-end: var(--space-5);
  transition: transform var(--motion-duration-slow) var(--motion-ease);
}

.portfolio-hero__headline-mask.is-pending .portfolio-hero__headline {
  transform: translateY(35%);
}

.portfolio-hero__intro {
  max-inline-size: 34rem;
}

/* The frame owns the rounding and the die-cut so the image itself needs
   neither, matching how every other section on the site frames a photo. */
.portfolio-hero__visual-frame {
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--color-bg-raised);
}

.portfolio-hero__image {
  display: block;
  inline-size: 100%;
  block-size: auto;
}

/* ---------------------------------------------------------------------
   Roster
--------------------------------------------------------------------- */

.portfolio-roster__notice {
  max-inline-size: 34rem;
  margin-block-end: var(--space-7);
}

.portfolio-roster__grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

/* min-inline-size: 0 lets a grid item shrink below its content's
   intrinsic width instead of forcing the track wider. */
.portfolio-roster__item {
  min-inline-size: 0;
}

.portfolio-roster__card {
  display: flex;
  flex-direction: column;
  block-size: 100%;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  overflow: hidden;
  transition:
    border-color var(--motion-duration-base) var(--motion-ease),
    box-shadow var(--motion-duration-base) var(--motion-ease);
}

.portfolio-roster__card:hover,
.portfolio-roster__card:focus-visible {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-sm);
}

.portfolio-roster__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: clamp(7rem, 14vw, 11rem);
  padding: clamp(var(--space-4), 3vw, var(--space-6));
}

.portfolio-roster__logo--empty {
  background: var(--color-bg-raised);
}

.portfolio-roster__logo-img {
  max-inline-size: 100%;
  max-block-size: 100%;
  object-fit: contain;
}

/* The rule separates the mark from the words about it, so the logo tile
   reads as artwork rather than as part of the label block. */
.portfolio-roster__body {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5);
  border-block-start: 1px solid var(--color-border);
  margin-block-start: auto;
}

.portfolio-roster__name {
  color: var(--color-text);
  overflow-wrap: anywhere;
}

.portfolio-roster__action {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.portfolio-roster__arrow {
  font-size: 1.125rem;
  transition: transform var(--motion-duration-fast) var(--motion-ease);
}

html[dir='rtl'] .portfolio-roster__arrow {
  transform: scaleX(-1);
}

.portfolio-roster__card:hover .portfolio-roster__action,
.portfolio-roster__card:focus-visible .portfolio-roster__action {
  color: var(--color-text);
}

/* The arrow travels the way the row reads, so the nudge is written per
   direction rather than mirrored into pointing backwards. */
.portfolio-roster__card:hover .portfolio-roster__arrow,
.portfolio-roster__card:focus-visible .portfolio-roster__arrow {
  transform: translate(0.15rem, -0.15rem);
}

html[dir='rtl'] .portfolio-roster__card:hover .portfolio-roster__arrow,
html[dir='rtl'] .portfolio-roster__card:focus-visible .portfolio-roster__arrow {
  transform: scaleX(-1) translate(0.15rem, -0.15rem);
}

/* ---------------------------------------------------------------------
   Closing
--------------------------------------------------------------------- */

.portfolio-enquiry {
  padding-block: clamp(var(--space-9), 8vw, var(--space-10));
}

.portfolio-enquiry__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(var(--space-6), 5vw, var(--space-9));
}

.portfolio-enquiry__heading {
  color: var(--color-text-on-dark);
  max-inline-size: 20ch;
}

.portfolio-enquiry__body {
  margin-block-start: var(--space-4);
  max-inline-size: 34rem;
  color: var(--color-text-on-dark-muted);
}

.portfolio-enquiry__action {
  flex-shrink: 0;
}

/* The primary button shares the inverse surface colour, so a white
   outline is what makes it read as a button here. */
.portfolio-enquiry__action :deep(.base-button) {
  border-color: var(--color-text-on-dark);
}

/* ---------------------------------------------------------------------
   Breakpoints — the homepage hero's own split and scale
--------------------------------------------------------------------- */

@media (min-width: 1024px) {
  .portfolio-hero__inner {
    gap: clamp(var(--space-5), 3vw, var(--space-7));
  }

  .portfolio-hero__text {
    flex: 1 1 43%;
  }

  /* No max-inline-size on purpose: a fixed rem cap doesn't scale with the
     viewport the way the font-size clamp does, which leaves bigger text
     crammed into the same narrow column on a wide screen. */
  .portfolio-hero__headline {
    margin-block-end: var(--space-4);
    font-size: clamp(1.75rem, 1.1rem + 1.6vw, 3rem);
  }

  .portfolio-hero__intro {
    max-inline-size: 27rem;
  }

  .portfolio-hero__visual {
    flex: 1 1 57%;
  }
}

@media (max-width: 1023px) {
  .portfolio-hero__inner {
    flex-direction: column;
    align-items: stretch;
  }

  .portfolio-hero__text,
  .portfolio-hero__visual {
    flex: none;
    inline-size: 100%;
  }

  /* Image first once stacked, as on the homepage: the visual is the
     section's opening statement, not a footnote to the copy. */
  .portfolio-hero__visual {
    order: -1;
    margin-block-end: var(--space-6);
  }
}

@media (max-width: 767px) {
  .portfolio-roster__grid {
    grid-template-columns: 1fr;
  }

  .portfolio-enquiry__inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
