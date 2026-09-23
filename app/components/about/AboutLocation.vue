<script setup lang="ts">
import type { AboutLocationContent } from '~~/types/content'

defineProps<{ content: AboutLocationContent }>()
</script>

<template>
  <section class="location">
    <BaseContainer class="stack-section location__inner">
      <MotionReveal class="location__text">
        <p class="text-label text-muted">
          {{ content.eyebrow }}
        </p>
        <h2 class="text-h1 location__heading">
          {{ content.heading }}
        </h2>
        <p class="text-body-lg text-muted location__body">
          {{ content.body }}
        </p>
      </MotionReveal>

      <!--
        The owner-supplied Riyadh skyline (2026-09-23) carries this section
        now, with the city name set over it. It replaces the abstract dark
        card that stood in while there was no image: naming the city over a
        picture of that city says the same thing far more directly.

        Still not a map — the profile's own GCC map graphic is
        reference-only and unapproved (item 3), and drawing a substitute
        would be inventing an asset. And still no coverage numbers: "+70
        cities", "+3000 retail points" and the rest stay blocked (item 5).

        The photograph is decorative (alt=""); every word over it is real
        text in the DOM, not burnt into the image.
      -->
      <MotionReveal
        :delay="140"
        class="location__marker"
      >
        <div class="location__card media-frame">
          <img
            src="/images/about/location.jpeg"
            width="1536"
            height="1024"
            alt=""
            class="location__image"
            loading="lazy"
            decoding="async"
          >
          <div class="location__plate">
            <p class="text-label location__card-label">
              {{ content.cityLabel }}
            </p>
            <p class="text-h1 location__city">
              {{ content.city }}
            </p>
            <p
              v-if="content.address"
              class="text-small location__address"
            >
              {{ content.address }}
            </p>
          </div>
        </div>
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.location__inner {
  display: flex;
  align-items: center;
  gap: clamp(var(--space-6), 5vw, var(--space-9));
}

.location__text {
  flex: 1 1 52%;
}

.location__heading {
  margin-block: var(--space-4) var(--space-5);
}

.location__body {
  max-inline-size: 34rem;
}

.location__marker {
  flex: 1 1 40%;
}

.location__card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--color-bg-inverse);
  color: var(--color-text-on-dark);
  isolation: isolate;
}

.location__image {
  display: block;
  inline-size: 100%;
  block-size: auto;
}

/*
  The plate is what makes the type legible, not a decorative tint: the
  skyline's lower third carries bright road lighting, and white text sits
  straight on it unreadably. The gradient is opaque where the text is and
  clears well before the horizon, so the picture is still the picture.
*/
.location__plate {
  position: absolute;
  inset-inline: 0;
  inset-block-end: 0;
  padding: clamp(var(--space-5), 3vw, var(--space-7));
  background: linear-gradient(to top, rgb(17 17 17 / 0.92), rgb(17 17 17 / 0.55) 45%, transparent);
}

.location__card-label {
  color: var(--color-text-on-dark-muted);
}

/*
  text-h1, not text-display as when this was a bare card: the type now sits
  inside a 3/2 image rather than filling a panel of its own, and display
  scale would crowd the frame it is set into.
*/
.location__city {
  margin-block: var(--space-2) var(--space-3);
  line-height: var(--line-height-heading);
}

.location__address {
  color: var(--color-text-on-dark-muted);
  max-inline-size: 24rem;
}

@media (max-width: 1023px) {
  .location__inner {
    flex-direction: column;
    align-items: stretch;
  }

  /* flex-basis is a width hint for the row layout above; once stacked it
     would apply to the block axis and stretch these to fixed heights. */
  .location__text,
  .location__marker {
    flex: 0 0 auto;
  }
}
</style>
