<script setup lang="ts">
import type { AboutHeroContent } from '~~/types/content'

defineProps<{ content: AboutHeroContent }>()
</script>

<template>
  <section class="about-hero">
    <BaseContainer class="about-hero__inner">
      <div class="about-hero__text">
        <MotionReveal :delay="0">
          <p class="text-label text-muted">
            {{ content.eyebrow }}
          </p>
        </MotionReveal>
        <MotionReveal :delay="90">
          <h1 class="text-display about-hero__heading">
            {{ content.heading }}
          </h1>
        </MotionReveal>
        <MotionReveal :delay="200">
          <p class="text-body-lg text-muted about-hero__intro">
            {{ content.intro }}
          </p>
        </MotionReveal>
      </div>

      <MotionReveal
        :delay="150"
        class="about-hero__visual"
      >
        <!--
          Owner-supplied brand visual, replacing the abstract
          HomeEditorialVisual placeholder that used to fill this slot. It is
          a conceptual architectural image, not documentation of a Binzomah
          site, so it carries no facility claim and needs no caveat — the
          same footing as the homepage Hero's supplied brand visual (see
          docs/unresolved-content-approvals.md item 3).

          alt="" / decorative: the heading and intro beside it already carry
          the section's meaning in real text, and the image adds atmosphere
          rather than information.

          eager + fetchpriority="high" because this sits above the fold and
          is the page's largest contentful paint candidate. No <picture>
          sources yet — AVIF/WebP derivatives have not been generated, so
          the PNG ships alone; see the note in item 3.
        -->
        <div class="about-hero__visual-frame media-frame">
          <img
            src="/images/about/hero.jpeg"
            width="1448"
            height="1086"
            alt=""
            class="about-hero__image"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          >
        </div>
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.about-hero {
  padding-block-start: clamp(var(--space-8), 8vw, var(--space-10));
  padding-block-end: var(--space-section);
}

.about-hero__inner {
  display: flex;
  align-items: center;
  gap: clamp(var(--space-6), 5vw, var(--space-9));
}

/* 52/42 rather than the 58/34 the abstract placeholder sat in: that
   placeholder was a flat graphic panel that read fine at any size, while
   this is a deep architectural photograph whose perspective collapses in a
   narrow column. The text still leads. */
.about-hero__text {
  flex: 1 1 52%;
}

/*
  Keeps .text-display's role but overrides its size for this one heading.
  The shared token tops out at 5.5rem, which suits the short headlines the
  other page heroes carry; this one is seven words, so at full display scale
  it wrapped to four lines and left the text column standing far taller than
  the photograph beside it — the two halves of a side-by-side hero reading
  as unrelated blocks rather than one composition.

  4rem instead: still unmistakably the largest type on the page, roughly a
  fifth smaller than the token at desktop, and it settles the column to
  about the image's own height. Same clamp shape as the token so it scales
  down identically on small screens, where the layout stacks and the
  imbalance does not exist.

  Deliberately a local override rather than a step down to .text-h1: that
  would make this page's h1 visibly smaller than every other page's, which
  is a site-wide change, not the fix this heading needs.
*/
.about-hero__heading {
  font-size: clamp(2.5rem, 1.85rem + 2.6vw, 4rem);
  margin-block: var(--space-4) var(--space-5);
}

.about-hero__intro {
  max-inline-size: 34rem;
}

.about-hero__visual {
  flex: 1 1 42%;
}

/* The frame owns the rounding and clipping so the image itself needs no
   border-radius, matching how the homepage sections frame their photos. */
.about-hero__visual-frame {
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--color-bg-raised);
}

.about-hero__image {
  display: block;
  inline-size: 100%;
  block-size: auto;
}

@media (max-width: 1023px) {
  .about-hero__inner {
    flex-direction: column;
    align-items: stretch;
  }

  /* Full container width once stacked. The old 20rem cap suited the
     abstract placeholder panel, but it would render this landscape
     photograph at roughly 320x240 — too small to read the depth that is
     the whole point of the shot. */
  .about-hero__visual {
    flex: none;
    order: -1;
    inline-size: 100%;
    margin-block-end: var(--space-6);
  }
}
</style>
