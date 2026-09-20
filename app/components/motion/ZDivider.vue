<script setup lang="ts">
/**
 * Purely decorative divider, subtly inspired by the diagonal ribbon in the
 * wordmark's "Z". Restrained on purpose — see docs/motion-principles.md
 * for the boundary on using this motif elsewhere.
 */
</script>

<template>
  <div
    class="z-divider"
    aria-hidden="true"
  />
</template>

<style scoped>
.z-divider {
  block-size: 3px;
  inline-size: 100%;
  background: var(--gradient-silver);
}

html[dir="ltr"] .z-divider {
  clip-path: polygon(0 100%, 6% 0, 100% 0, 100% 100%);
}

html[dir="rtl"] .z-divider {
  clip-path: polygon(100% 100%, 94% 0, 0 0, 0 100%);
}
</style>
