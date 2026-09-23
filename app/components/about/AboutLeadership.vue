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
      <MotionReveal class="leadership__head">
        <p class="text-label text-muted">
          {{ content.eyebrow }}
        </p>
        <h2 class="text-h1 leadership__heading">
          {{ content.heading }}
        </h2>
        <p class="text-body-lg text-muted leadership__body">
          {{ content.body }}
        </p>
      </MotionReveal>

      <div
        v-if="content.chairman"
        class="leadership__chairman"
      >
        <MotionReveal class="chairman__portrait-col">
          <!--
            Portraits are real people, so alt text names them rather than
            being decorative like the abstract section visuals elsewhere on
            the site: the name beside the photo tells you who is pictured,
            but only if you can see the layout pairing them.

            No <picture> sources here, unlike the homepage photography —
            AVIF/WebP derivatives have not been generated for these files.
            The originals ship as supplied, byte-for-byte from the profile
            library, lazily below the fold.
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
          <p class="text-label text-muted">
            {{ content.chairman.label }}
          </p>
          <h3 class="text-h2 chairman__name">
            {{ content.chairman.person.name }}
          </h3>
          <p class="text-label text-muted chairman__role">
            {{ content.chairman.person.role }}
          </p>

          <p
            v-for="(paragraph, index) in content.chairman.biography"
            :key="index"
            class="text-muted chairman__paragraph"
          >
            {{ paragraph }}
          </p>

          <!-- A real attributed quote from the profile, so it is marked up
               as one rather than styled to look like one. -->
          <figure class="chairman__quote-figure">
            <blockquote class="chairman__quote">
              <p class="text-h3">
                {{ content.chairman.quote }}
              </p>
            </blockquote>
            <figcaption class="text-small text-muted chairman__attribution">
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
.leadership__head {
  margin-block-end: var(--space-8);
}

.leadership__heading {
  margin-block: var(--space-4) var(--space-5);
}

.leadership__body {
  max-inline-size: 38rem;
}

.leadership__chairman {
  display: flex;
  align-items: flex-start;
  gap: clamp(var(--space-6), 5vw, var(--space-9));
}

.chairman__portrait-col {
  flex: 0 0 auto;
  inline-size: min(20rem, 34vw);
}

/* object-fit on a fixed ratio is a presentational crop, not an edit to the
   asset: the seven team files ship at two slightly different heights, and a
   grid of mismatched portrait boxes reads as a mistake. 3/4 is the ratio six
   of the eight photos already have, so the crop is negligible. */
.chairman__portrait {
  inline-size: 100%;
  block-size: auto;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--color-bg-raised);
}

.chairman__text {
  flex: 1 1 auto;
}

.chairman__name {
  margin-block: var(--space-3) var(--space-2);
}

.chairman__role {
  margin-block-end: var(--space-5);
}

.chairman__paragraph + .chairman__paragraph {
  margin-block-start: var(--space-4);
}

/* Set off by a rule on the inline-start edge rather than quotation marks:
   the marks would have to flip glyph and side between the two locales, and
   a logical border does that on its own. */
.chairman__quote-figure {
  margin: var(--space-6) 0 0;
  padding-inline-start: var(--space-5);
  border-inline-start: 2px solid var(--color-border-strong);
}

.chairman__quote {
  margin: 0;
}

.chairman__attribution {
  margin-block-start: var(--space-3);
}

.leadership__team {
  margin-block-start: clamp(var(--space-8), 6vw, var(--space-9));
  padding-block-start: var(--space-7);
  border-block-start: 1px solid var(--color-border);
}

@media (max-width: 1023px) {
  .leadership__chairman {
    flex-direction: column;
  }

  .chairman__portrait-col {
    inline-size: min(18rem, 60vw);
  }
}
</style>
