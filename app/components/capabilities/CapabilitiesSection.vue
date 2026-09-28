<script setup lang="ts">
import type { CapabilitiesSectionItem } from '~~/types/content'

defineProps<{ item: CapabilitiesSectionItem, index: number }>()

const assetUrl = useAssetUrl()
</script>

<template>
  <!--
    Two independent alternations, which is why they are two conditions
    rather than one flag:

    - The surface alternates so no two adjacent bands share a background.
      The hero above sits on the base surface, so the first section takes
      the alt one, and the closing below lands on the inverse.
    - The layout side alternates on the opposite phase, so the zig-zag
      does not line up with the colour change and flatten back into a
      single rhythm.
  -->
  <section
    class="cap-section"
    :class="{ 'is-reversed': index % 2 === 1, 'surface-alt': index % 2 === 0 }"
  >
    <BaseContainer class="stack-section cap-section__inner">
      <MotionReveal class="cap-section__visual-wrap">
        <div class="cap-section__visual-frame media-frame">
          <picture>
            <source
              type="image/avif"
              :srcset="`${assetUrl(`/images/home/capabilities-${index + 1}-480.avif`)} 480w, ${assetUrl(`/images/home/capabilities-${index + 1}-960.avif`)} 960w`"
              sizes="(max-width: 1023px) 22rem, 42vw"
            >
            <source
              type="image/webp"
              :srcset="`${assetUrl(`/images/home/capabilities-${index + 1}-480.webp`)} 480w, ${assetUrl(`/images/home/capabilities-${index + 1}-960.webp`)} 960w`"
              sizes="(max-width: 1023px) 22rem, 42vw"
            >
            <img
              :src="assetUrl(`/images/home/capabilities-${index + 1}.png`)"
              width="1122"
              height="1402"
              alt=""
              aria-hidden="true"
              class="cap-section__visual-image"
              loading="lazy"
              decoding="async"
            >
          </picture>
        </div>
      </MotionReveal>

      <MotionReveal
        :delay="120"
        class="cap-section__text"
      >
        <!--
          The number leads the text, as it does on the homepage's
          capability rows. It used to sit above the photograph in the other
          column, which pushed the photo down by its own height and left
          the two columns starting on different lines. Here it opens the
          text instead, so the photo and the heading begin together.

          aria-hidden: "01" is an ordinal the layout already conveys, and a
          screen reader reading it before every heading adds nothing.
        -->
        <span
          class="cap-section__number"
          aria-hidden="true"
        >{{ item.number }}</span>
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
/*
  align-items: center, not flex-start. These photographs are portraits and
  the copy beside them is short — a title and two paragraphs — so pinning
  both columns to the top left 200-300px of empty section under the text
  while the image ran on past it. Centring puts that space above and below
  the text instead, where it reads as margin rather than as a hole.
*/
.cap-section__inner {
  display: flex;
  align-items: center;
  gap: clamp(var(--space-6), 5vw, var(--space-9));
}

.cap-section.is-reversed .cap-section__inner {
  /* Alternates the visual/text side per section, regardless of writing
     direction — row-reverse always flips relative to whatever "row"
     currently means, so the zig-zag stays consistent in both LTR and RTL. */
  flex-direction: row-reverse;
}

/*
  An explicit width rather than a share of the row: at 42% of a 1240px
  container these 1122x1402 portraits rendered about 494px wide and 617px
  tall, which overran the viewport on a laptop and towered over the copy.
  Capped at 26rem the frame is roughly 520px tall — close to the text
  block's own height, and the section fits on screen.
*/
.cap-section__visual-wrap {
  flex: 0 0 auto;
  inline-size: clamp(16rem, 34vw, 26rem);
}

/* The homepage's own number treatment — h2 scale rather than the display
   scale this carried while it stood alone in the visual column. */
.cap-section__number {
  display: block;
  margin-block-end: var(--space-3);
  font-size: var(--font-size-h2);
  font-weight: 600;
  line-height: 1;
  color: var(--color-border-strong);
}

/* Same frame language as the homepage Capabilities teaser: a hairline
   edge and a soft lifted shadow, sized to the source photos' own
   1122:1402 ratio. Reuses public/images/home/capabilities-1/2/3, the same
   approved photos already shown for these three items on the homepage. */
.cap-section__visual-frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1122 / 1402;
  border-radius: var(--radius-md);
  border: 1px solid rgb(17 17 17 / 0.06);
  box-shadow: 0 24px 48px -28px rgb(17 17 17 / 0.28);
}

.cap-section__visual-image {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
  background: var(--color-bg-raised);
}

.cap-section__text {
  flex: 1 1 auto;
  min-inline-size: 0;
}

.cap-section__title {
  margin-block-end: var(--space-4);
}

.cap-section__summary {
  margin-block-end: var(--space-4);
  max-inline-size: 34rem;
}

.cap-section__body {
  max-inline-size: 34rem;
  margin-block-end: var(--space-6);
}

@media (max-width: 1023px) {
  .cap-section__inner,
  .cap-section.is-reversed .cap-section__inner {
    flex-direction: column;
  }

  .cap-section__visual-wrap {
    order: -1;
    inline-size: min(22rem, 100%);
    margin-inline: auto;
    margin-block-end: var(--space-6);
  }
}
</style>
