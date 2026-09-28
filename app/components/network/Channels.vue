<script setup lang="ts">
import type { NetworkChannel } from '~~/types/network'

defineProps<{ heading: string, channels: NetworkChannel[] }>()
</script>

<template>
  <!-- surface-alt: this band used to share one inverse wrapper with the
       hero above it — see the surface-rhythm note in Experience.vue. -->
  <section
    id="customer-channels"
    class="network-channels surface-alt"
    tabindex="-1"
  >
    <BaseContainer>
      <MotionReveal>
        <h2 class="text-h2 network-channels__heading">
          {{ heading }}
        </h2>
      </MotionReveal>

      <!--
        The five channels read across the band rather than down it. As a
        stack they were five full-width rows at heading scale — the page's
        longest stretch by far, for five entries whose descriptions run to
        about fifty characters each. Side by side they are what they
        actually are: one market approached through five routes.

        The rule-over-each-column treatment is the one the About page's key
        strategies already use, so the two read as one system.
      -->
      <ol class="network-channels__list">
        <li
          v-for="(channel, index) in channels"
          :id="channel.id"
          :key="channel.id"
          class="network-channels__item"
          tabindex="-1"
        >
          <!-- Capped stagger: past the fourth column an uncapped index
               delay runs beyond half a second, so the last entries land
               well after the row is already on screen. -->
          <MotionReveal :delay="Math.min(index, 3) * 90">
            <span
              class="text-label text-muted network-channels__index"
              aria-hidden="true"
            >{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="text-h4 network-channels__name">
              {{ channel.name }}
            </h3>
            <p class="text-small text-muted network-channels__description">
              {{ channel.description }}
            </p>
          </MotionReveal>
        </li>
      </ol>
    </BaseContainer>
  </section>
</template>

<style scoped>
.network-channels {
  padding-block: var(--space-section);
}

/* The scroll offset lives on the anchor target, which is the list item —
   clearing the 5.5rem sticky header plus a little air. */
.network-channels,
.network-channels__item {
  scroll-margin-block-start: 7rem;
}

.network-channels__heading {
  max-inline-size: 25ch;
  margin-block-end: var(--space-8);
}

.network-channels__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: var(--space-7) clamp(var(--space-4), 2.5vw, var(--space-6));
}

/* The rule is the column's own top edge, so the five read as one banded
   row rather than as five loose blocks. */
.network-channels__item {
  padding-block-start: var(--space-5);
  border-block-start: 2px solid var(--color-border);
  transition: border-color var(--motion-duration-base) var(--motion-ease);
}

/*
  Arriving from one of the hero's jump links now lands on a row where all
  five are already visible, so the target has to say which one was asked
  for — otherwise the link scrolls somewhere and identifies nothing. The
  item is focusable (tabindex="-1"), so a keyboard user gets the same
  signal on arrival.
*/
.network-channels__item:target,
.network-channels__item:focus-visible {
  border-block-start-color: var(--color-text);
  outline: none;
}

.network-channels__name {
  margin-block: var(--space-3) var(--space-2);
  overflow-wrap: anywhere;
}

@media (max-width: 1023px) {
  .network-channels__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 639px) {
  .network-channels__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-6) var(--space-4);
  }
}

@media (max-width: 389px) {
  .network-channels__list {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
