/**
 * Reactive `prefers-reduced-motion` flag for JS-driven motion (the CSS
 * media query in main.css handles transition/animation duration on its
 * own; this is only for motion that is initiated from script, such as the
 * MotionReveal IntersectionObserver).
 */
export function usePrefersReducedMotion() {
  const prefersReduced = ref(false)

  if (import.meta.client) {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReduced.value = query.matches

    const update = (event: MediaQueryListEvent) => {
      prefersReduced.value = event.matches
    }

    query.addEventListener('change', update)
    onScopeDispose(() => query.removeEventListener('change', update))
  }

  return prefersReduced
}
