<script setup lang="ts">
import type { CapabilitiesClosingContent } from '~~/types/content'

defineProps<{ content: CapabilitiesClosingContent }>()
</script>

<template>
  <!--
    Closing on the inverse surface, in the shape the homepage's partnership
    block established and the brands page follows: the statement at heading
    scale with the action beside it, rather than a centred column on the
    same white the three sections above already sit on.

    It also completes the page's surface rhythm — hero (base), sections
    alternating, and a dark band to end on.
  -->
  <section class="cap-closing surface-inverse">
    <BaseContainer class="cap-closing__inner">
      <MotionReveal class="cap-closing__text">
        <span
          class="cap-closing__accent"
          aria-hidden="true"
        />
        <h2 class="text-h1 cap-closing__heading">
          {{ content.heading }}
        </h2>
      </MotionReveal>

      <MotionReveal
        :delay="120"
        class="cap-closing__action"
      >
        <BaseButton
          :to="content.cta.to"
          variant="primary"
        >
          {{ content.cta.label }}
        </BaseButton>
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.cap-closing {
  padding-block: clamp(var(--space-9), 8vw, var(--space-10));
}

.cap-closing__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(var(--space-6), 5vw, var(--space-9));
}

/* The silver rule now leads the statement instead of separating it from
   the button — it reads as a mark opening the block rather than as a
   divider inside it. */
.cap-closing__accent {
  display: block;
  inline-size: 4rem;
  block-size: 3px;
  margin-block-end: var(--space-5);
  background: var(--gradient-silver);
}

.cap-closing__heading {
  color: var(--color-text-on-dark);
  max-inline-size: 20ch;
}

.cap-closing__action {
  flex-shrink: 0;
}

/* The primary button shares the inverse surface colour, so a white
   outline is what makes it read as a button here. */
.cap-closing__action :deep(.base-button) {
  border-color: var(--color-text-on-dark);
}

@media (max-width: 767px) {
  .cap-closing__inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
