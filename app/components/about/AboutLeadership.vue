<script setup lang="ts">
import type { AboutLeadershipContent } from '~~/types/content'

// Structural placeholder only. `content.body` is neutral status copy — this
// component must never render a name, photo, or invented biography. See
// docs/unresolved-content-approvals.md and types/content.ts's note on
// AboutLeadershipContent.
defineProps<{ content: AboutLeadershipContent }>()
</script>

<template>
  <section class="leadership surface-alt">
    <BaseContainer
      content
      class="stack-section"
    >
      <MotionReveal>
        <p class="text-label text-muted">
          {{ content.eyebrow }}
        </p>
        <h2 class="text-h2 leadership__heading">
          {{ content.heading }}
        </h2>
        <p class="text-body-lg text-muted">
          {{ content.body }}
        </p>
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.leadership__heading {
  margin-block: var(--space-4) var(--space-3);
}
</style>
