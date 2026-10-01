import type { Ref } from 'vue'

/** Shared user, visibility and reduced-motion controls for automatic motion. */
export function useMotionPlayback(target: Ref<HTMLElement | null>) {
  const prefersReduced = usePrefersReducedMotion()
  const mounted = ref(false)
  const paused = ref(false)
  const visible = ref(false)
  const pageHidden = ref(false)
  const canAnimate = computed(() => mounted.value && !prefersReduced.value)
  const running = computed(() => canAnimate.value && !paused.value && visible.value && !pageHidden.value)

  onMounted(() => {
    mounted.value = true
    const updateVisibility = () => {
      pageHidden.value = document.visibilityState === 'hidden'
    }
    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)
    const observer = typeof IntersectionObserver === 'undefined'
      ? undefined
      : new IntersectionObserver((entries) => {
          visible.value = entries.some(entry => entry.isIntersecting)
        })
    if (target.value && observer) observer.observe(target.value)
    else visible.value = true
    onScopeDispose(() => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', updateVisibility)
    })
  })

  function toggle() {
    paused.value = !paused.value
  }
  return { canAnimate, running, paused, prefersReduced, toggle }
}
