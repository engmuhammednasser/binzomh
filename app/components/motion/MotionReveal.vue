<script setup lang="ts">
/**
 * Subtle reveal-on-scroll primitive. Skips straight to visible when
 * prefers-reduced-motion is set, or when IntersectionObserver isn't
 * available, so content is never hidden behind motion.
 */
const prefersReduced = usePrefersReducedMotion()
const el = ref<HTMLElement | null>(null)
const visible = ref(false)

onMounted(() => {
  if (prefersReduced.value || typeof IntersectionObserver === 'undefined' || !el.value) {
    visible.value = true
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.2 },
  )

  observer.observe(el.value)
  onScopeDispose(() => observer.disconnect())
})
</script>

<template>
  <div
    ref="el"
    class="reveal"
    :class="{ 'is-visible': visible }"
  >
    <slot />
  </div>
</template>
