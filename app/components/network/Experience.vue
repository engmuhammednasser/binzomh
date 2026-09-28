<script setup lang="ts">
import type { NetworkPageContent } from '~~/types/network'

const props = defineProps<{ content: NetworkPageContent }>()
// An entry earns its place with a name or with artwork. Three marks in
// the company profile's channel slides are real, approved logos that the
// profile never identifies — they have no name to filter on, so requiring
// one dropped them silently. See docs/unresolved-content-approvals.md
// item 9.
const approvedPartners = computed(() =>
  props.content.partners.names.filter(partner =>
    partner.status === 'approved' && (partner.name?.trim() || partner.logo),
  ),
)
const assetUrl = useAssetUrl()
</script>

<template>
  <div class="network-experience">
    <!--
      Surface rhythm: hero (base) → channels (alt) → reach (base) →
      partners (alt) → enquiry (inverse). The hero and the channel list
      used to share one inverse wrapper, which put about 1650px of
      unbroken charcoal — two viewport heights — at the top of the page
      before any other surface appeared.

      The hero keeps its two columns: the statement on one side and the
      in-page jump nav to the five channels on the other. That nav is why
      this hero needs no photograph to fill its second column.
    -->
    <header class="network-hero">
      <BaseContainer>
        <MotionReveal :delay="0">
          <p class="text-label text-muted network-hero__eyebrow">
            {{ content.eyebrow }}
          </p>
        </MotionReveal>
        <div class="network-hero__grid">
          <div>
            <MotionReveal :delay="90">
              <h1 class="text-display">
                {{ content.title }}
              </h1>
            </MotionReveal>
            <MotionReveal :delay="200">
              <p class="text-body-lg text-muted network-hero__intro">
                {{ content.intro }}
              </p>
            </MotionReveal>
          </div>
          <MotionReveal :delay="150">
            <nav
              class="network-hero__nav"
              :aria-label="content.channelsLabel"
            >
              <p class="text-label text-muted">
                {{ content.channelsLabel }}
              </p>
              <a
                v-for="channel in content.channels"
                :key="channel.id"
                :href="`#${channel.id}`"
              >
                <span>{{ channel.name }}</span>
                <span aria-hidden="true">↓</span>
              </a>
            </nav>
          </MotionReveal>
        </div>
      </BaseContainer>
    </header>

    <NetworkChannels
      :heading="content.channelsHeading"
      :channels="content.channels"
    />

    <section class="network-reach">
      <BaseContainer class="network-reach__grid">
        <MotionReveal>
          <h2 class="text-h1">
            {{ content.reach.heading }}
          </h2>
        </MotionReveal>
        <MotionReveal :delay="120">
          <p class="text-body-lg text-muted">
            {{ content.reach.body }}
          </p>
          <p class="text-small network-reach__note">
            {{ content.reach.note }}
          </p>
        </MotionReveal>
      </BaseContainer>
    </section>

    <section class="network-partners surface-alt">
      <BaseContainer>
        <MotionReveal class="network-partners__head">
          <h2 class="text-h2">
            {{ content.partners.heading }}
          </h2>
          <p class="text-body-lg text-muted">
            {{ content.partners.body }}
          </p>
        </MotionReveal>
        <template v-if="approvedPartners.length">
          <ul class="network-partners__logos">
            <li
              v-for="partner in approvedPartners"
              :key="partner.logo?.src ?? partner.name"
              class="network-partners__logo"
            >
              <!--
                An unnamed mark renders decoratively: alt text has to say
                something true, and "which company this is" is exactly what
                nobody has confirmed. A sighted reader may recognise it; a
                screen reader is told nothing rather than a guess.
              -->
              <img
                v-if="partner.logo"
                :src="assetUrl(partner.logo.src)"
                :width="partner.logo.width"
                :height="partner.logo.height"
                :alt="partner.name ?? ''"
                :aria-hidden="partner.name ? undefined : 'true'"
                decoding="async"
                loading="lazy"
              >
              <span
                v-else
                class="text-small"
              >{{ partner.name }}</span>
            </li>
          </ul>
          <p
            v-if="content.partners.note"
            class="text-small text-muted network-partners__note"
          >
            {{ content.partners.note }}
          </p>
        </template>
        <div
          v-else
          class="network-partners__pending"
        >
          <p class="text-label">
            {{ content.partners.pendingLabel }}
          </p>
          <p class="text-small text-muted">
            {{ content.partners.pendingBody }}
          </p>
        </div>
      </BaseContainer>
    </section>

    <section class="network-enquiry surface-inverse">
      <BaseContainer class="network-enquiry__inner">
        <MotionReveal class="network-enquiry__text">
          <h2 class="text-h1 network-enquiry__heading">
            {{ content.enquiry.heading }}
          </h2>
          <p class="text-body-lg network-enquiry__body">
            {{ content.enquiry.body }}
          </p>
        </MotionReveal>
        <MotionReveal
          :delay="120"
          class="network-enquiry__action"
        >
          <BaseButton
            :to="content.enquiry.cta.to"
            variant="primary"
          >
            {{ content.enquiry.cta.label }}
          </BaseButton>
        </MotionReveal>
      </BaseContainer>
    </section>
  </div>
</template>

<style scoped>
.network-hero {
  padding-block: var(--space-section);
}

.network-hero__eyebrow {
  margin-block-end: var(--space-5);
}

.network-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.6fr);
  gap: var(--space-9);
}

.network-hero__intro {
  max-inline-size: 34rem;
  margin-block-start: var(--space-5);
}

.network-hero__nav {
  padding-inline-start: var(--space-6);
  border-inline-start: 1px solid var(--color-border);
}

.network-hero__nav p {
  margin-block-end: var(--space-5);
}

.network-hero__nav a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-block: var(--space-4);
  min-block-size: 44px;
  border-block-end: 1px solid var(--color-border);
  color: var(--color-text);
  text-decoration: none;
}

.network-hero__nav a:hover,
.network-hero__nav a:focus-visible {
  text-decoration: underline;
}

.network-reach,
.network-partners {
  padding-block: var(--space-section);
}

.network-enquiry {
  padding-block: clamp(var(--space-9), 8vw, var(--space-10));
}

.network-enquiry__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(var(--space-6), 5vw, var(--space-9));
}

.network-enquiry__heading {
  color: var(--color-text-on-dark);
  max-inline-size: 20ch;
}

.network-enquiry__body {
  margin-block-start: var(--space-4);
  max-inline-size: 34rem;
  color: var(--color-text-on-dark-muted);
}

.network-enquiry__action {
  flex-shrink: 0;
}

/* The primary button shares the inverse surface colour, so a white
   outline is what makes it read as a button here. */
.network-enquiry__action :deep(.base-button) {
  border-color: var(--color-text-on-dark);
}

.network-reach__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
  gap: var(--space-9);
}

.network-partners__head {
  max-inline-size: 34rem;
  margin-block-end: var(--space-7);
}

.network-reach__note {
  margin-block-start: var(--space-6);
  padding-inline-start: var(--space-5);
  border-inline-start: 2px solid var(--color-border-strong);
}

.network-partners p {
  margin-block-start: var(--space-4);
}

.network-partners__pending {
  padding: var(--space-6);
  border: 1px dashed var(--color-border-strong);
}

.network-partners__pending p:first-child {
  margin-block-start: 0;
}

/* Source logos (public/logos/partners/) are already transparent PNGs at
   modest native resolution (~130-200px) — a dense grayscale-to-color wall
   suits both the file quality and a large roster better than the singular,
   larger cards used for the three principal brand logos. See
   docs/unresolved-content-approvals.md item 9 for the scoped approval. */
.network-partners__logos {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
  gap: var(--space-4);
}

.network-partners__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 5.5rem;
  padding: var(--space-3);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.network-partners__logo img {
  max-inline-size: 100%;
  max-block-size: 100%;
  object-fit: contain;
  filter: grayscale(1);
  opacity: 0.7;
  transition: filter var(--motion-duration-base) var(--motion-ease), opacity var(--motion-duration-base) var(--motion-ease);
}

.network-partners__logo:hover img {
  filter: grayscale(0);
  opacity: 1;
}

.network-partners__note {
  margin-block-start: var(--space-6);
  max-inline-size: 34rem;
}

@media (max-width: 767px) {
  .network-hero__grid,
  .network-reach__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-7);
  }

  /* The rule that separates the jump nav from the statement is an
     inline-start border while the two sit side by side; stacked, it has
     to become a top border or it hangs off the side of nothing. */
  .network-hero__nav {
    padding-inline-start: 0;
    padding-block-start: var(--space-6);
    border-inline-start: 0;
    border-block-start: 1px solid var(--color-border);
  }

  .network-enquiry__inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
