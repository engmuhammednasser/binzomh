<script setup lang="ts">
import type { NetworkPageContent } from '~~/types/network'

const props = defineProps<{ content: NetworkPageContent }>()
const approvedPartners = computed(() => props.content.partners.names.filter(partner => partner.status === 'approved' && partner.name.trim()))
const assetUrl = useAssetUrl()
</script>

<template>
  <div class="network-experience">
    <div class="surface-inverse">
      <header class="network-hero">
        <BaseContainer>
          <p class="text-label network-hero__eyebrow">
            {{ content.eyebrow }}
          </p>
          <div class="network-hero__grid">
            <div>
              <h1 class="text-display">
                {{ content.title }}
              </h1>
              <p class="text-h2 network-hero__intro">
                {{ content.intro }}
              </p>
            </div>
            <nav
              class="network-hero__nav"
              :aria-label="content.channelsLabel"
            >
              <p class="text-label">
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
          </div>
        </BaseContainer>
      </header>
      <NetworkChannels
        :heading="content.channelsHeading"
        :channels="content.channels"
      />
    </div>

    <section class="network-reach">
      <BaseContainer class="network-reach__grid">
        <h2 class="text-h1">
          {{ content.reach.heading }}
        </h2>
        <div>
          <p class="text-body-lg text-muted">
            {{ content.reach.body }}
          </p>
          <p class="text-small network-reach__note">
            {{ content.reach.note }}
          </p>
        </div>
      </BaseContainer>
    </section>

    <section class="network-partners surface-alt">
      <BaseContainer>
        <div class="network-partners__head">
          <h2 class="text-h2">
            {{ content.partners.heading }}
          </h2>
          <p class="text-body-lg text-muted">
            {{ content.partners.body }}
          </p>
        </div>
        <template v-if="approvedPartners.length">
          <ul class="network-partners__logos">
            <li
              v-for="partner in approvedPartners"
              :key="partner.name"
              class="network-partners__logo"
            >
              <img
                v-if="partner.logo"
                :src="assetUrl(partner.logo.src)"
                :width="partner.logo.width"
                :height="partner.logo.height"
                :alt="partner.name"
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

    <section class="network-enquiry">
      <BaseContainer content>
        <h2 class="text-h1">
          {{ content.enquiry.heading }}
        </h2>
        <p class="text-body-lg text-muted">
          {{ content.enquiry.body }}
        </p>
        <BaseButton :to="content.enquiry.cta.to">
          {{ content.enquiry.cta.label }}
        </BaseButton>
      </BaseContainer>
    </section>
  </div>
</template>

<style scoped>
.network-hero {
  padding-block: var(--space-section);
}

.network-hero__eyebrow {
  color: var(--color-text-on-dark-muted);
  margin-block-end: var(--space-5);
}

.network-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.6fr);
  gap: var(--space-9);
}

.network-hero__intro {
  max-inline-size: 22ch;
  margin-block-start: var(--space-7);
  color: var(--color-text-on-dark-muted);
}

.network-hero__nav {
  padding-inline-start: var(--space-6);
  border-inline-start: 1px solid var(--color-border-strong);
}

.network-hero__nav p {
  color: var(--color-text-on-dark-muted);
  margin-block-end: var(--space-5);
}

.network-hero__nav a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-block: var(--space-4);
  min-block-size: 44px;
  border-block-end: 1px solid var(--color-border-strong);
  text-decoration: none;
}

.network-hero__nav a:hover,
.network-hero__nav a:focus-visible {
  text-decoration: underline;
}

.network-reach,
.network-partners,
.network-enquiry {
  padding-block: var(--space-section);
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

.network-enquiry p {
  margin-block: var(--space-5) var(--space-6);
}

@media (max-width: 767px) {
  .network-hero__grid,
  .network-reach__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-7);
  }
}
</style>
