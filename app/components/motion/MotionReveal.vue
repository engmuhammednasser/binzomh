<script setup lang="ts">
/**
 * Subtle reveal-on-scroll primitive. Content starts (and stays, over SSR /
 * no-JS / a failed client bundle) visible — see the `.reveal` rule in
 * main.css. Only once mounted, client-side, do we opt IN to the hidden
 * pre-animation state (`isPending`), and only when we're actually going to
 * animate: prefers-reduced-motion and missing IntersectionObserver support
 * both skip it entirely, so content is never hidden without a guarantee of
 * being revealed again.
 *
 * `delay` staggers a group of reveals (e.g. a hero's eyebrow, headline,
 * description, CTA) that all cross the intersection threshold at once on
 * initial load — it is inert until then, so it never delays reduced-motion
 * or no-JS visibility.
 */
const props = defineProps<{ delay?: number }>()

const prefersReduced = usePrefersReducedMotion()
const el = ref<HTMLElement | null>(null)
const isPending = ref(false)

const delayStyle = computed(() =>
  props.delay ? { transitionDelay: `${props.delay}ms` } : undefined,
)

onMounted(() => {
  if (prefersReduced.value || typeof IntersectionObserver === 'undefined' || !el.value) {
    return
  }

  isPending.value = true

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting) {
        isPending.value = false
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
    :class="{ 'is-pending': isPending }"
    :style="delayStyle"
  >
    <slot />
  </div>
</template>
