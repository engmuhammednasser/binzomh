<script setup lang="ts">
/**
 * Floating scroll-progress control: a ring that fills clockwise as the page
 * is scrolled down and unwinds again on the way back up, wrapped around a
 * "back to top" button.
 *
 * Deliberately not placed inside the footer's legal strip: that strip is a
 * single, short line and anything added to it grows the footer again.
 *
 * SSR: renders nothing on the server and nothing on the first client render
 * (isVisible starts false in both), so there is no hydration mismatch.
 * onMounted then reads the real scroll position, which also covers a reload
 * part-way down the page or a deep link to a #hash.
 */
const { t } = useI18n()
const prefersReduced = usePrefersReducedMotion()

// Geometry of the ring, in the SVG's own 48-unit viewBox. The circumference
// is the dasharray, and the offset walks it back to zero as progress fills.
const RING_RADIUS = 21
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

const isVisible = ref(false)
const progress = ref(0)

// Two decimals is well past sub-pixel at this size; the raw float would put
// a 17-digit number in the DOM on every frame for no visible gain.
const dashOffset = computed(() => (RING_LENGTH * (1 - progress.value)).toFixed(2))

const read = () => {
  // Total scrollable distance. Guards a page shorter than the viewport,
  // where the denominator would be 0 and the ratio NaN.
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  progress.value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0

  // Appears early — at roughly a third of a viewport rather than a full one
  // — so the ring is caught near the start of its sweep and the filling is
  // actually legible, instead of snapping in already half-complete.
  isVisible.value = window.scrollY > window.innerHeight * 0.3
}

let frame = 0

const onScroll = () => {
  // Coalesce to one read per painted frame: unlike the old boolean, this
  // writes a style on every event, so an unthrottled handler would do
  // layout work far more often than the screen can show it.
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    read()
  })
}

onMounted(() => {
  read()
  // Passive: neither handler calls preventDefault, so the browser can keep
  // scrolling on the compositor instead of waiting on them. resize is
  // included because scrollHeight and innerHeight both feed the ratio.
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  onScopeDispose(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (frame) cancelAnimationFrame(frame)
  })
})

function scrollToTop() {
  // The global prefers-reduced-motion rule in main.css only forces the CSS
  // scroll-behavior property; a scripted scrollTo carries its own behavior
  // and has to be told separately.
  window.scrollTo({ top: 0, behavior: prefersReduced.value ? 'auto' : 'smooth' })
}
</script>

<template>
  <Transition name="back-to-top">
    <button
      v-if="isVisible"
      type="button"
      class="back-to-top"
      :aria-label="t('nav.backToTop')"
      @click="scrollToTop"
    >
      <!--
        The ring is decorative: it restates the scroll position a screen
        reader already reports, so it carries no progressbar role that would
        compete with the button's own label.

        Once the page reaches the top the button unmounts, which drops focus
        back to the document body — keyboard tab order restarts at the skip
        link, which is exactly where "back to top" should leave someone.
      -->
      <svg
        class="back-to-top__ring"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <circle
          class="back-to-top__track"
          cx="24"
          cy="24"
          :r="RING_RADIUS"
        />
        <circle
          class="back-to-top__progress"
          cx="24"
          cy="24"
          :r="RING_RADIUS"
          :stroke-dasharray="RING_LENGTH.toFixed(2)"
          :stroke-dashoffset="dashOffset"
        />
      </svg>
      <!--
        An arrow travelling into a ceiling line, not a bare up-arrow: the
        line is what distinguishes "jump to the very top" from a generic
        "up", and it gives the mark a fixed edge for the shaft to move
        toward on hover.
      -->
      <svg
        class="back-to-top__arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          class="back-to-top__arrow-ceiling"
          d="M5.5 5h13"
        />
        <path
          class="back-to-top__arrow-shaft"
          d="M12 19.5V9.5m-4.5 4.5L12 9.5l4.5 4.5"
        />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
/*
  A light disc rather than the dark one it replaced: every surface on the
  site is white or near-white, so a solid ink circle floating over them read
  as a heavy foreign object. The ring itself now carries the definition —
  a hairline track in the border tone with the progress arc in ink — which
  also leaves the two states (empty / filled) unmistakable at 48px.
*/
.back-to-top {
  position: fixed;
  /* Logical insets: bottom-right in English, bottom-left in Arabic. */
  inset-block-end: clamp(var(--space-4), 3vw, var(--space-6));
  inset-inline-end: clamp(var(--space-4), 3vw, var(--space-6));
  /* Above the sticky header (50), below the skip link (100) and the mobile
     nav overlay (200), so neither is ever covered by it. */
  z-index: 60;
  display: grid;
  place-items: center;
  /* 3rem = 48px: a comfortable touch target, and wide enough for the ring
     to be readable as an arc rather than a hairline smudge. */
  inline-size: 3rem;
  block-size: 3rem;
  padding: 0;
  border: 0;
  /* 999px, not 50%: identical on a fixed-size square, and the blocked-metrics
     guard in tests/n03-routes.test.mjs scans the rendered HTML — which can
     include this inlined CSS — for "50%", one of the metrics
     docs/unresolved-content-approvals.md item 5 blocks from public display. */
  border-radius: 999px;
  background: var(--color-bg);
  color: var(--color-text);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition:
    background-color var(--motion-duration-fast) var(--motion-ease),
    color var(--motion-duration-fast) var(--motion-ease);
}

/* Both children sit in the same grid cell so the arrow is centred inside
   the ring without either being taken out of flow. */
.back-to-top__ring,
.back-to-top__arrow {
  grid-area: 1 / 1;
}

.back-to-top__ring {
  inline-size: 3rem;
  block-size: 3rem;
  /* Start the sweep at twelve o'clock instead of three. */
  transform: rotate(-90deg);
}

.back-to-top__track {
  stroke: var(--color-border);
  stroke-width: 2;
}

/* No transition on the offset: it is rewritten once per animation frame
   already, so easing it would only make the ring lag the scroll. */
.back-to-top__progress {
  stroke: currentcolor;
  stroke-width: 2;
  stroke-linecap: round;
}

/* 1.25rem from a 24-unit viewBox renders the 2-unit stroke at ~1.7px —
   deliberately a touch lighter than the ring's 2px, so the icon reads as
   the content inside the indicator rather than competing with it. */
.back-to-top__arrow {
  inline-size: 1.25rem;
  block-size: 1.25rem;
}

/* The shaft travels toward the fixed ceiling line on hover — the gesture
   the button performs, in miniature. 1.5 user units at this scale is just
   over a pixel: felt, not watched. The global prefers-reduced-motion rule
   in main.css flattens the duration, so no separate guard is needed. */
.back-to-top__arrow-shaft {
  transition: transform var(--motion-duration-fast) var(--motion-ease);
}

.back-to-top:hover .back-to-top__arrow-shaft,
.back-to-top:focus-visible .back-to-top__arrow-shaft {
  transform: translateY(-1.5px);
}

/* Inverts to ink on hover rather than tinting: the palette has no accent
   hue to reach for, so contrast is the interaction. The progress arc rides
   currentColor, so it flips with the face for free. */
.back-to-top:hover,
.back-to-top:focus-visible {
  background: var(--color-bg-inverse);
  color: var(--color-text-on-dark);
}

.back-to-top:hover .back-to-top__track,
.back-to-top:focus-visible .back-to-top__track {
  stroke: var(--color-text-subtle);
}

/* The global :focus-visible rule assumes a rectangle; match the circle. */
.back-to-top:focus-visible {
  border-radius: 999px;
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition:
    opacity var(--motion-duration-base) var(--motion-ease),
    transform var(--motion-duration-base) var(--motion-ease);
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}
</style>
