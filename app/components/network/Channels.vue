<script setup lang="ts">
import type { NetworkChannel } from '~~/types/network'

defineProps<{ heading: string, channels: NetworkChannel[] }>()
</script>

<template>
  <section
    id="customer-channels"
    class="network-channels"
    tabindex="-1"
  >
    <BaseContainer>
      <h2 class="text-h2">
        {{ heading }}
      </h2>
      <ol class="network-channels__list">
        <li
          v-for="(channel, index) in channels"
          :id="channel.id"
          :key="channel.id"
          class="network-channels__row"
          tabindex="-1"
        >
          <span
            class="text-label network-channels__index"
            aria-hidden="true"
          >{{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="text-h1">
            {{ channel.name }}
          </h3>
          <p class="text-body-lg">
            {{ channel.description }}
          </p>
        </li>
      </ol>
    </BaseContainer>
  </section>
</template>

<style scoped>
.network-channels {
  padding-block-end: var(--space-section);
}

.network-channels,
.network-channels__row {
  scroll-margin-block-start: 7rem;
}

.network-channels h2 {
  max-inline-size: 25ch;
  margin-block-end: var(--space-8);
}

.network-channels__list {
  padding: 0;
  list-style: none;
}

.network-channels__row {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) minmax(0, 0.7fr);
  align-items: baseline;
  gap: var(--space-6);
  padding-block: var(--space-7);
  border-block-start: 1px solid var(--color-border-strong);
}

.network-channels__row h3 {
  overflow-wrap: anywhere;
}

.network-channels__row p,
.network-channels__index {
  color: var(--color-text-on-dark-muted);
}

@media (max-width: 767px) {
  .network-channels__row {
    grid-template-columns: 1.5rem minmax(0, 1fr);
    gap: var(--space-4);
  }

  .network-channels__row p {
    grid-column: 2;
  }

  .network-channels__row h3 {
    font-size: var(--font-size-h2);
  }
}
</style>
