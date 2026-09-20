<script setup lang="ts">
import type { NetworkPageContent } from '~~/types/network'

const props = defineProps<{ content: NetworkPageContent }>()
const approvedPartners = computed(() => props.content.partners.names.filter(partner => partner.status === 'approved' && partner.name.trim()))
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
      <BaseContainer class="network-partners__grid">
        <div>
          <h2 class="text-h2">
            {{ content.partners.heading }}
          </h2>
          <p class="text-body-lg text-muted">
            {{ content.partners.body }}
          </p>
        </div>
        <ul
          v-if="approvedPartners.length"
          class="network-partners__names"
        >
          <li
            v-for="partner in approvedPartners"
            :key="partner.name"
            class="text-h3"
          >
            {{ partner.name }}
          </li>
        </ul>
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

.network-reach__grid,
.network-partners__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
  gap: var(--space-9);
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

.network-partners__names {
  padding-inline-start: var(--space-5);
}

.network-partners__names li + li {
  margin-block-start: var(--space-4);
}

.network-enquiry p {
  margin-block: var(--space-5) var(--space-6);
}

@media (max-width: 767px) {
  .network-hero__grid,
  .network-reach__grid,
  .network-partners__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-7);
  }
}
</style>
