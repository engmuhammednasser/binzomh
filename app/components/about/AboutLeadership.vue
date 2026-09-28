<script setup lang="ts">
import type { AboutLeadershipContent } from '~~/types/content'

/**
 * Real, named people — approved for publication by the owner on 2026-09-23
 * (docs/unresolved-content-approvals.md item 10). Before that this was a
 * structural placeholder that rendered no name or portrait at all.
 *
 * The rule that replaced it is narrower, not gone: this component renders
 * exactly what the content files carry, and those may only carry people the
 * company profile itself names. Never add a person, title, quote or photo
 * here that is not in that approval.
 *
 * Every block is guarded, so the section degrades to its framing copy if
 * the chairman or the team is ever withdrawn from the content files.
 */
defineProps<{ content: AboutLeadershipContent }>()

// Dynamic src bypasses Nuxt's build-time base-path prefixing (same reason as
// HomeHero.vue / HomeAbout.vue) — apply it explicitly. See
// shared/utils/asset-url.ts.
const assetUrl = useAssetUrl()
</script>

<template>
  <section class="leadership surface-alt">
    <BaseContainer class="stack-section">
      <!--
        The eyebrow carries a short rule off its end — the editorial device
        the reference opens with. It is drawn in CSS rather than added to
        the DOM, so nothing new reaches a screen reader.
      -->
      <MotionReveal class="leadership__head">
        <p class="text-label text-muted leadership__eyebrow">
          {{ content.eyebrow }}
        </p>
        <h2 class="text-h1 leadership__heading">
          {{ content.heading }}
        </h2>
        <p class="text-muted leadership__body">
          {{ content.body }}
        </p>
      </MotionReveal>

      <div
        v-if="content.chairman"
        class="chairman"
      >
        <!--
          The rail: a hairline and a position counter, no more. The
          reference also runs rotated copy and a pair of arrows down here;
          the copy exists in no approved source, and arrows would be
          controls for a carousel of one. "01 / 01" is true, and it is
          decorative for a screen reader — the chairman is already named in
          real text beside it — so it is hidden from one.
        -->
        <div
          class="chairman__rail"
          aria-hidden="true"
        >
          <span class="chairman__rail-line" />
          <span class="text-label chairman__counter">01 / 01</span>
        </div>

        <MotionReveal class="chairman__portrait-col">
          <!--
            A real person, so the alt text names them rather than being
            decorative like the abstract section visuals elsewhere on the
            site: the name beside the photo tells you who is pictured, but
            only if you can see the layout pairing them.

            The die-cut is back, as the reference has it. The supplied file
            is 1122x1402 — exactly the 4:5 this frame asks for — so
            object-fit has nothing to crop.
          -->
          <img
            :src="assetUrl(content.chairman.person.photo)"
            :width="content.chairman.person.width"
            :height="content.chairman.person.height"
            :alt="content.chairman.person.name"
            class="chairman__portrait media-frame"
            loading="lazy"
            decoding="async"
          >
        </MotionReveal>

        <MotionReveal
          :delay="120"
          class="chairman__text"
        >
          <p class="text-label text-muted chairman__label">
            {{ content.chairman.label }}
          </p>
          <h3 class="chairman__name">
            {{ content.chairman.person.name }}
          </h3>
          <p class="text-label text-muted chairman__role">
            {{ content.chairman.person.role }}
          </p>

          <div class="chairman__bio">
            <p
              v-for="(paragraph, index) in content.chairman.biography"
              :key="index"
              class="chairman__paragraph"
            >
              {{ paragraph }}
            </p>
          </div>

          <!--
            A real attributed quote from the profile, so it is marked up as
            one rather than styled to look like one. The oversized quotation
            mark and the rule beside it are drawn in CSS, not placed in the
            DOM: a screen reader already knows this is a blockquote, and a
            stray punctuation glyph in the text would only be read aloud.
          -->
          <figure class="chairman__quote-figure">
            <blockquote class="chairman__quote">
              <p class="chairman__quote-text">
                {{ content.chairman.quote }}
              </p>
            </blockquote>
            <figcaption class="text-label text-muted chairman__attribution">
              {{ content.chairman.person.name }}
            </figcaption>
          </figure>
        </MotionReveal>
      </div>

      <div
        v-if="content.team?.length"
        class="leadership__team"
      >
        <MotionReveal>
          <AboutTeamCarousel
            :label="content.teamLabel"
            :people="content.team"
          />
        </MotionReveal>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
/* ---------------------------------------------------------------------
   Intro
--------------------------------------------------------------------- */

/* The eyebrow's trailing rule. A pseudo-element, so the mark never reaches
   the accessibility tree or the text content. */
.leadership__eyebrow {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.leadership__eyebrow::after {
  content: '';
  inline-size: 4rem;
  block-size: 1px;
  background: var(--color-border-strong);
}

.leadership__head {
  max-inline-size: 44rem;
  margin-block-end: clamp(var(--space-8), 6vw, var(--space-9));
}

.leadership__heading {
  margin-block: var(--space-3) var(--space-4);
}

.leadership__body {
  max-inline-size: 34rem;
}

/* ---------------------------------------------------------------------
   Chairman feature

   Mobile-first: the stacked order is the content's own order (portrait,
   label, name, role, biography, quote), so the single-column case needs
   almost no rules, and the composition is the addition rather than the
   thing being undone.
--------------------------------------------------------------------- */
.chairman {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* The rail is a desktop device: at phone width there is no margin to hang
   it in, and a hairline above a stacked portrait would read as a divider. */
.chairman__rail {
  display: none;
}

.chairman__portrait-col {
  inline-size: min(20rem, 72vw);
}

/* The die-cut does the framing, so there is no radius or ring to add — a
   rounded corner on one side and a sliced corner on the other would read as
   an accident. */
.chairman__portrait {
  display: block;
  inline-size: 100%;
  block-size: auto;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  background: var(--color-bg-raised);
}

.chairman__label {
  margin-block-end: var(--space-3);
}

/*
  Below the section heading on purpose. The reference leads with the
  section's own statement and sets the chairman a step under it, which is
  the opposite of the hierarchy this component carried before — so the
  heading takes the h1 step and the name tops out around 48px.
*/
.chairman__name {
  font-size: clamp(1.875rem, 1.5rem + 1.7vw, 3rem);
  margin-block-end: var(--space-2);
}

.chairman__role {
  margin-block-end: clamp(var(--space-4), 2vw, var(--space-5));
}

/* Narrower than the column it sits in — around 62 characters at this size,
   which is the point of capping it rather than letting the text run the
   full width the content column occupies. */
.chairman__bio {
  max-inline-size: 36rem;
}

/* A flat 17px with 1.6 leading, rather than a curve reaching 18px at 1.7.
   The biography runs to roughly 770 characters, and at the old settings it
   stood some 390px taller than the portrait beside it — this and the
   tightened margins below take about 200px out of that without dropping
   the body under the 17px this feature is specified to hold. */
.chairman__paragraph {
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--color-text-muted);
  max-inline-size: none;
}

/* Arabic needs the looser leading its own token sets; the global rule only
   applies it to headings. */
html[dir="rtl"] .chairman__paragraph {
  line-height: var(--line-height-body-ar);
}

.chairman__paragraph + .chairman__paragraph {
  margin-block-start: var(--space-3);
}

/* ---------------------------------------------------------------------
   Quote
--------------------------------------------------------------------- */

/* An oversized quotation mark set outside the text, with a hairline between
   the two. Both are drawn here rather than placed in the DOM: the mark is
   punctuation a screen reader would otherwise announce, and the blockquote
   element already carries the meaning. */
.chairman__quote-figure {
  position: relative;
  max-inline-size: 38rem;
  margin: clamp(var(--space-5), 3vw, var(--space-6)) 0 0;
  padding-inline-start: clamp(var(--space-7), 6vw, 4.5rem);
}

.chairman__quote-figure::before {
  content: '\201C';
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: -0.35em;
  font-size: 4.5rem;
  line-height: 1;
  color: var(--color-border-strong);
}

/* The correct opening mark for the direction, rather than the same glyph
   mirrored — a left double quote turned around is not what Arabic opens
   with. */
html[dir="rtl"] .chairman__quote-figure::before {
  content: '\201D';
}

.chairman__quote-figure::after {
  content: '';
  position: absolute;
  inset-block: 0.35rem 0;
  inset-inline-start: clamp(var(--space-5), 4vw, 3rem);
  inline-size: 1px;
  background: var(--color-border);
}

.chairman__quote {
  margin: 0;
}

/* 20px to 26px — a step under the h3 token it used to take. The section
   heading is at h1 and the name around 48px, so the quote reads as the
   feature's second voice rather than competing with whose voice it is, and
   the smaller setting costs the text column another line of height. */
.chairman__quote-text {
  font-size: clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem);
  font-weight: 500;
  line-height: 1.4;
  color: var(--color-text);
  max-inline-size: none;
}

.chairman__attribution {
  margin-block-start: var(--space-3);
}

/* ---------------------------------------------------------------------
   Transition into the management team
--------------------------------------------------------------------- */

/* A full rule and a wider gap than anything inside the chairman feature:
   the two belong to the same section but are not the same kind of content,
   and the team row needs a visible start of its own. */
.leadership__team {
  margin-block-start: clamp(var(--space-9), 7vw, var(--space-10));
  padding-block-start: clamp(var(--space-7), 4vw, var(--space-8));
  border-block-start: 1px solid var(--color-border);
}

/* ---------------------------------------------------------------------
   Composition
--------------------------------------------------------------------- */

@media (min-width: 768px) {
  .chairman {
    flex-direction: row;
    align-items: flex-start;
    /* 40px here, ~65px at 1440, capped at 80px. */
    gap: clamp(2.5rem, 4.5vw, 5rem);
  }

  /* Its own narrow column beside the portrait, as in the reference: a
     hairline that runs most of the portrait's height with the counter
     sitting under it. */
  .chairman__rail {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-5);
    /* Nudged down so the rule starts level with the portrait rather than
       with the column's very top edge. */
    padding-block-start: var(--space-4);
  }

  .chairman__rail-line {
    inline-size: 1px;
    block-size: clamp(5rem, 12vw, 9rem);
    background: var(--color-border-strong);
  }

  .chairman__counter {
    color: var(--color-text-subtle);
    /* Written left-to-right in both locales: these are index digits with a
       separator, not a sentence. */
    direction: ltr;
  }

  .chairman__portrait-col {
    flex: 0 0 36%;
    inline-size: auto;
    max-inline-size: 28rem;
  }

  /* min-inline-size: 0 stops a flex item from refusing to shrink below its
     content's intrinsic width, which is what produces horizontal overflow
     on a long unbroken name. */
  .chairman__text {
    flex: 1 1 auto;
    min-inline-size: 0;
  }
}

@media (min-width: 1024px) {
  /*
    The portrait and its rail travel with the reader.

    The biography cannot be made to match the portrait's height by
    typography: at roughly 770 characters it still stands about 140px
    taller even after the tightening above and a wider frame, and closing
    the rest would mean setting the body near 13px. Sticky solves the
    actual problem instead — the portrait stays beside whichever paragraph
    is being read, so the composition is balanced at every scroll position
    rather than at one arbitrary one, and it stays balanced if the
    biography is ever edited.

    5.5rem is the sticky header's height (a 2.5rem logo plus its
    clamped padding); the extra space keeps the portrait from sitting
    flush against it.
  */
  .chairman__rail,
  .chairman__portrait-col {
    position: sticky;
    inset-block-start: calc(5.5rem + var(--space-6));
  }

  .chairman__rail {
    /* Held clear of the portrait so the rail reads as margin furniture
       rather than part of the image's frame. */
    margin-inline-end: clamp(var(--space-4), 2vw, var(--space-6));
  }

  .chairman__portrait-col {
    flex-basis: 38%;
  }
}
</style>
