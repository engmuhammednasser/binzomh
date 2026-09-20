<script setup lang="ts">
import type { CapabilitiesClosingContent } from '~~/types/content'

defineProps<{ content: CapabilitiesClosingContent }>()
</script>

<template>
  <section class="cap-closing">
    <BaseContainer
      content
      class="cap-closing__inner"
    >
      <MotionReveal>
        <h2 class="text-display cap-closing__heading">
          {{ content.heading }}
        </h2>
        <span
          class="cap-closing__accent"
          aria-hidden="true"
        />
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
  padding-block: var(--space-section);
  text-align: center;
}

.cap-closing__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cap-closing__heading {
  margin-block-end: var(--space-6);
}

.cap-closing__accent {
  display: block;
  inline-size: 4rem;
  block-size: 3px;
  margin-block-end: var(--space-7);
  background: var(--gradient-silver);
}
</style>
