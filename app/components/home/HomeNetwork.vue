<script setup lang="ts">
import type { HomeNetworkContent } from '~~/types/content'

defineProps<{ content: HomeNetworkContent }>()

const assetUrl = useAssetUrl()
</script>

<template>
  <section class="network surface-inverse">
    <BaseContainer class="stack-section">
      <MotionReveal class="network__head">
        <p class="text-label network__eyebrow">
          {{ content.eyebrow }}
        </p>
        <h2 class="text-h1 network__heading">
          {{ content.heading }}
        </h2>
        <p class="text-body-lg network__intro">
          {{ content.intro }}
        </p>
      </MotionReveal>

      <ul class="network__list">
        <li
          v-for="(channel, index) in content.channels"
          :key="channel"
          class="network__row"
        >
          <MotionReveal :delay="index * 80">
            <div class="network__card">
              <span class="text-label network__index">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="network__name">{{ channel }}</span>
            </div>
          </MotionReveal>
        </li>
      </ul>

      <MotionReveal
        v-if="content.logos?.length"
        :delay="content.channels.length * 80"
        class="network__logos-block"
      >
        <p
          v-if="content.logosLabel"
          class="text-small network__logos-label"
        >
          {{ content.logosLabel }}
        </p>
        <div
          class="network__logos-track"
          aria-hidden="true"
        >
          <div class="network__logos-marquee">
            <div
              v-for="(entry, i) in [...content.logos, ...content.logos]"
              :key="`${entry.name}-${i}`"
              class="network__logo"
            >
              <img
                :src="assetUrl(entry.logo.src)"
                :width="entry.logo.width"
                :height="entry.logo.height"
                alt=""
                decoding="async"
                loading="lazy"
              >
            </div>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal
        v-if="content.cta"
        :delay="(content.channels.length + (content.logos?.length ? 1 : 0)) * 80"
      >
        <BaseButton
          :to="content.cta.to"
          variant="secondary"
          class="network__cta"
        >
          {{ content.cta.label }}
        </BaseButton>
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.network__head {
  margin-block-end: var(--space-8);
}

.network__eyebrow {
  color: var(--color-text-on-dark-muted);
}

.network__heading {
  margin-block: var(--space-4);
  color: var(--color-text-on-dark);
}

.network__intro {
  max-inline-size: 34rem;
  color: var(--color-text-on-dark-muted);
}

.network__list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-4);
  margin-block-end: var(--space-8);
}

.network__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-block-size: 8rem;
  padding: var(--space-5);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  transition: border-color var(--motion-duration-base) var(--motion-ease);
}

.network__card:hover {
  border-color: var(--color-text-on-dark);
}

.network__index {
  color: var(--color-text-on-dark-muted);
}

.network__name {
  margin-block-start: auto;
  font-size: var(--font-size-h4);
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-text-on-dark);
}

.network__logos-block {
  margin-block-end: var(--space-8);
}

.network__logos-label {
  color: var(--color-text-on-dark-muted);
  margin-block-end: var(--space-4);
}

/* Same white logo-tile language as the homepage Brands cards and the
   /network "Clients & partners" wall — a curated preview of that same
   roster, not a separate approval. See
   docs/unresolved-content-approvals.md item 9.

   An infinite marquee rather than a static grid: the logo list is
   rendered twice back to back and the track animates exactly -50%, so
   the seam between the two copies is invisible and the loop never has
   to reset or pause. The track's mask fades both edges to the section's
   own background so tiles don't hard-cut at the container edge — which
   stays the same width as the five channel cards above it. */
.network__logos-track {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 4rem, black calc(100% - 4rem), transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 4rem, black calc(100% - 4rem), transparent);
}

.network__logos-marquee {
  display: flex;
  inline-size: max-content;
  gap: var(--space-4);
  animation: network-logos-scroll 34s linear infinite;
}

@keyframes network-logos-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .network__logos-marquee {
    animation-play-state: paused;
  }
}

.network__logo {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 10rem;
  block-size: 7rem;
  padding: var(--space-3);
  background: var(--color-bg);
  border-radius: var(--radius-md);
}

.network__logo img {
  max-inline-size: 100%;
  max-block-size: 100%;
  object-fit: contain;
}

.network__cta {
  border-color: var(--color-text-on-dark-muted);
  color: var(--color-text-on-dark);
}

.network__cta:hover {
  border-color: var(--color-text-on-dark);
}

@media (max-width: 900px) {
  .network__list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .network__list {
    grid-template-columns: 1fr;
  }
}
</style>
