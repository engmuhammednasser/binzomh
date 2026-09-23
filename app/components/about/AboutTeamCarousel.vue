<script setup lang="ts">
import type { AboutPerson } from '~~/types/content'

/**
 * Team carousel: a row of wide member cards, navigated by the round
 * portrait thumbnails above it and the controls below. The thumbnails are
 * the position indicator — there is no separate row of dots, because a dot
 * says "slide 3 of 7" while a face says whose slide it is.
 *
 * Built on native scroll snapping rather than a transformed track. A
 * transform has to know the card width, the gap and the writing direction
 * to compute an offset, and gets all three wrong at some breakpoint or in
 * Arabic; the browser already knows them. That also gives touch swiping and
 * trackpad scrolling for free, and keeps the cards reachable if JavaScript
 * never runs — the section degrades to a plain scrollable row.
 *
 * The row loops forwards forever. See `loop` and `step` below for how.
 */
const props = defineProps<{ label?: string, people: AboutPerson[] }>()

const { t } = useI18n()
const assetUrl = useAssetUrl()
const prefersReduced = usePrefersReducedMotion()

const track = ref<HTMLElement | null>(null)

/**
 * The cards, read straight off the track in DOM order.
 *
 * Not a `ref="cards"` array on the v-for: Vue makes no promise that a
 * template ref collected in a loop comes back in source order, and when it
 * does not, every index in this file points at the wrong card — the
 * carousel steps to the wrong place and the thumbnail ring marks the wrong
 * person. The element's own children are ordered by definition. Comment
 * nodes from Vue's fragment markers are not Elements, so `children` holds
 * exactly the list items.
 */
function cardList() {
  return Array.from(track.value?.children ?? []) as HTMLElement[]
}

/**
 * The roster rendered three times over.
 *
 * A carousel that runs off the end of its own list has to get back to the
 * start somehow, and scrolling the whole row backwards is the jarring part
 * — it reads as a rewind, not as a loop. With the roster repeated, the
 * position "showing the last member" also exists one copy earlier, looking
 * exactly the same; jumping between those two identical positions costs
 * nothing visually, and the carousel can then keep moving forwards
 * indefinitely.
 *
 * Three copies rather than two because the jump happens *before* the
 * animated step, while the row is at rest: that needs a whole roster's
 * worth of track on both sides of the resting band, which two copies cannot
 * provide. Resting positions therefore live in the middle copy, and `step`
 * returns to it whenever a move would leave it.
 *
 * The outer copies are aria-hidden, so assistive technology reads the seven
 * real people once, in order. No card holds anything focusable, so hiding
 * them traps nothing.
 */
const COPIES = 3
const REST_COPY = 1

const loop = computed(() =>
  Array.from({ length: COPIES }).flatMap((_, copy) =>
    props.people.map(person => ({ person, copy, key: `${copy}-${person.slug}` })),
  ),
)

// Index into `loop` of the card aligned to the track's inline start. Two
// cards fit side by side at desktop width, so "which one is on screen" has
// no single answer; the leading one does.
const active = ref(0)

// Which of the seven real people that is — what the thumbnail ring reports.
const activePerson = computed(() => active.value % props.people.length)

/**
 * Distance, in physical pixels, from the track's inline-start edge to the
 * element's. Positive means the element sits further along the scroll.
 * Using getBoundingClientRect on both sides keeps this correct in Arabic,
 * where the inline start is the right edge and scrollLeft runs negative.
 */
function inlineOffset(el: HTMLElement, rtl: boolean) {
  const t = track.value!.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  return rtl ? t.right - r.right : r.left - t.left
}

function isRtl() {
  return getComputedStyle(track.value!).direction === 'rtl'
}

function read() {
  const el = track.value
  if (!el) return

  const rtl = isRtl()
  let best = 0
  let bestDistance = Number.POSITIVE_INFINITY
  cardList().forEach((card, index) => {
    const distance = Math.abs(inlineOffset(card, rtl))
    if (distance < bestDistance) {
      bestDistance = distance
      best = index
    }
  })
  active.value = best
}

function scrollToIndex(index: number, smooth: boolean) {
  const el = track.value
  const target = cardList()[index]
  if (!el || !target) return

  // scrollBy on the track, not scrollIntoView on the card: scrollIntoView
  // walks every scrollable ancestor, so it dragged the whole page along
  // with it whenever a thumbnail or arrow was used. This moves the track
  // and nothing else.
  el.scrollBy({
    left: inlineOffset(target, isRtl()) * (isRtl() ? -1 : 1),
    behavior: smooth && !prefersReduced.value ? 'smooth' : 'auto',
  })
}

/**
 * Move `delta` cards, re-entering the middle copy first if this move would
 * leave it. The re-entry is an instant scroll between two identical-looking
 * positions one roster apart, performed while the row is still at rest, so
 * the animated step that follows starts from a settled position and the
 * swap is invisible.
 */
function step(delta: number) {
  const n = props.people.length
  let next = active.value + delta

  if (next >= (REST_COPY + 1) * n) {
    scrollToIndex(active.value - n, false)
    next -= n
  }
  else if (next < REST_COPY * n) {
    scrollToIndex(active.value + n, false)
    next += n
  }

  scrollToIndex(next, true)
  restart()
}

/** Jump to a person by their index in the roster, via the nearest copy. */
function goToPerson(index: number) {
  const n = props.people.length
  const nearest = [index, index + n, index + 2 * n].reduce((a, b) =>
    Math.abs(b - active.value) < Math.abs(a - active.value) ? b : a,
  )
  scrollToIndex(nearest, true)
  restart()
}

/* ---------------------------------------------------------------------
   Automatic rotation
--------------------------------------------------------------------- */

const ROTATE_MS = 5000

/**
 * Client-only, and read in onMounted rather than during setup. The
 * prefers-reduced-motion composable resolves synchronously on the client,
 * so branching the template on it directly would render something different
 * from the server's HTML and break hydration. Starting false means the
 * server emits no rotation control at all — correct, since it is useless
 * without JavaScript.
 */
const canAutoplay = ref(false)

const playing = ref(true)
const hovered = ref(false)
const focused = ref(false)
const pageHidden = ref(false)

// Every reason to hold still, in one place. Hover and focus are courtesy
// pauses — someone reading a card should not have it slide away — while
// `playing` is the explicit control and `pageHidden` stops the timer doing
// invisible work in a background tab.
const running = computed(() =>
  canAutoplay.value && playing.value && !hovered.value && !focused.value && !pageHidden.value,
)

let timer: ReturnType<typeof setInterval> | undefined

function restart() {
  clearInterval(timer)
  if (running.value) timer = setInterval(() => step(1), ROTATE_MS)
}

let frame = 0

function onScroll() {
  // One read per painted frame: a scroll handler that measures every card
  // would otherwise run layout far more often than the screen can show it.
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    read()
  })
}

onMounted(() => {
  // Captured now rather than read again on teardown: by the time the scope
  // disposes, the template ref has already been cleared, so the listener
  // would never be removed.
  const el = track.value
  if (!el) return

  // Into the middle copy. The server rendered the row at scroll zero, which
  // shows the first copy's first member — the same person this lands on, so
  // nothing visibly moves.
  scrollToIndex(REST_COPY * props.people.length, false)
  read()

  el.addEventListener('scroll', onScroll, { passive: true })
  // A resize changes both which cards fit and the scroll extent, so the
  // measurements have to be retaken.
  window.addEventListener('resize', onScroll, { passive: true })

  canAutoplay.value = !prefersReduced.value

  const onVisibility = () => {
    pageHidden.value = document.visibilityState === 'hidden'
  }
  document.addEventListener('visibilitychange', onVisibility)

  // One watcher owns the timer's whole lifecycle, so there is no path that
  // starts a second interval or leaves one running.
  const stop = watch(running, restart, { immediate: true })

  onScopeDispose(() => {
    stop()
    clearInterval(timer)
    el.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    document.removeEventListener('visibilitychange', onVisibility)
    if (frame) cancelAnimationFrame(frame)
  })
})
</script>

<template>
  <!--
    Pointer and keyboard both hold the rotation: moving onto the carousel or
    tabbing into it stops the cards sliding out from under whoever is
    reading them. Neither replaces the explicit control below — WCAG 2.2.2
    wants a mechanism the reader can operate, not one that depends on them
    keeping a pointer in place.
  -->
  <div
    class="team"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="focused = true"
    @focusout="focused = false"
  >
    <div class="team__head">
      <p
        v-if="label"
        class="text-label text-muted team__label"
      >
        {{ label }}
      </p>

      <!--
        The thumbnails are real buttons, not decoration: each one moves the
        carousel and names who it moves to, so a screen-reader user hears
        "Show Samar Lotfy, Medical Detailing & Training Manager" rather than
        "button, image". aria-current marks the one on screen.
      -->
      <ul class="team__thumbs">
        <li
          v-for="(person, index) in people"
          :key="person.slug"
        >
          <button
            type="button"
            class="team__thumb"
            :class="{ 'is-active': index === activePerson }"
            :aria-label="t('team.show', { name: person.name, role: person.role })"
            :aria-current="index === activePerson ? 'true' : undefined"
            @click="goToPerson(index)"
          >
            <img
              :src="assetUrl(person.photo)"
              :width="person.width"
              :height="person.height"
              alt=""
              class="team__thumb-image"
              loading="lazy"
              decoding="async"
            >
          </button>
        </li>
      </ul>
    </div>

    <!--
      tabindex="0" + role/aria-label: a scrollable region has to be
      focusable for anyone driving the page from the keyboard, and it needs
      a name so it is announced as something other than an unlabelled group.
    -->
    <ul
      ref="track"
      class="team__track"
      tabindex="0"
      role="group"
      :aria-label="t('team.carousel')"
    >
      <li
        v-for="item in loop"
        :key="item.key"
        class="team__card"
        :aria-hidden="item.copy === 1 ? undefined : 'true'"
      >
        <div class="team__card-media media-frame">
          <img
            :src="assetUrl(item.person.photo)"
            :width="item.person.width"
            :height="item.person.height"
            :alt="item.copy === 1 ? item.person.name : ''"
            class="team__card-image"
            loading="lazy"
            decoding="async"
          >
        </div>
        <!-- Name and role only. The reference this follows also carries an
             email, a phone number and a bio per person; none of those exist
             for this team in any approved source, and none would be
             invented to fill the layout. -->
        <div class="team__card-body">
          <p class="text-h3 team__name">
            {{ item.person.name }}
          </p>
          <p class="text-small text-muted team__role">
            {{ item.person.role }}
          </p>
        </div>
      </li>
    </ul>

    <div class="team__controls">
      <button
        type="button"
        class="team__arrow"
        :aria-label="t('team.previous')"
        @click="step(-1)"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M15 5 8 12l7 7"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        class="team__arrow"
        :aria-label="t('team.next')"
        @click="step(1)"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m9 5 7 7-7 7"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <!--
        Rendered only once the client has confirmed rotation is actually on
        (see canAutoplay): a pause button for something that never moves —
        which is the case under prefers-reduced-motion, and without
        JavaScript — would be a control that does nothing.

        The label states the action, not the state, so a screen reader
        announces "Pause automatic rotation" rather than leaving the reader
        to infer what the icon currently means.
      -->
      <button
        v-if="canAutoplay"
        type="button"
        class="team__arrow team__arrow--play"
        :aria-label="playing ? t('team.pause') : t('team.play')"
        @click="playing = !playing"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <g
            v-if="playing"
            fill="currentColor"
          >
            <rect
              x="8"
              y="6"
              width="2.5"
              height="12"
              rx="1"
            />
            <rect
              x="13.5"
              y="6"
              width="2.5"
              height="12"
              rx="1"
            />
          </g>
          <path
            v-else
            d="M8.5 5.8v12.4L18 12z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.team__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-block-end: var(--space-6);
}

/* ---------------------------------------------------------------------
   Thumbnails — the position indicator, in place of dots.
--------------------------------------------------------------------- */
.team__thumbs {
  list-style: none;
  padding-inline-start: 0;
  display: flex;
  align-items: center;
}

/* Overlapped into a row, logical so the deck runs the correct way in both
   locales. The active thumb pulls clear of its neighbours below. */
.team__thumbs > li + li {
  margin-inline-start: -0.75rem;
}

.team__thumb {
  display: block;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  border-radius: 999px;
  transition:
    transform var(--motion-duration-fast) var(--motion-ease),
    opacity var(--motion-duration-fast) var(--motion-ease);
  /* Dimmed until selected, so the active face is findable at a glance
     rather than one of seven identical circles. */
  opacity: 0.55;
}

.team__thumb:hover {
  opacity: 1;
}

.team__thumb.is-active {
  opacity: 1;
  /* Lifted out of the overlap so its ring is a complete circle, not one
     clipped by the next thumbnail. */
  position: relative;
  z-index: 1;
  transform: scale(1.12);
}

.team__thumb-image {
  display: block;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  border-radius: 999px;
  object-fit: cover;
  /* The ring doubles as the separator between overlapping thumbs, so it is
     always present — only its colour changes. */
  border: 2px solid var(--color-bg-alt);
  background: var(--color-bg-raised);
}

.team__thumb.is-active .team__thumb-image {
  border-color: var(--color-text);
}

.team__thumb:focus-visible {
  border-radius: 999px;
}

/* ---------------------------------------------------------------------
   Track — native scroll snapping, one card per step.
--------------------------------------------------------------------- */
.team__track {
  list-style: none;
  padding-inline-start: 0;
  margin: 0;
  display: flex;
  gap: clamp(var(--space-4), 2vw, var(--space-6));
  overflow-x: auto;
  scroll-snap-type: inline mandatory;
  /* Room for the card's lift and shadow, which a clipped overflow would
     otherwise shave off. */
  padding-block: var(--space-2);
  /* The scrollbar is redundant next to the arrows and thumbnails, and on
     platforms that reserve space for it, it shifts the cards. */
  scrollbar-width: none;
}

.team__track::-webkit-scrollbar {
  display: none;
}

.team__card {
  flex: 0 0 auto;
  inline-size: min(34rem, 88vw);
  scroll-snap-align: start;
  display: flex;
  align-items: stretch;
  gap: var(--space-5);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  box-shadow: var(--shadow-sm);
}

/*
  No dimming of the non-leading cards. Two cards fit side by side at desktop
  width, so fading the one that is not "active" faded a card the reader can
  see in full — it read as disabled rather than as secondary. Which card
  leads is shown by the thumbnail ring instead, where it costs the content
  nothing. Cards still partly outside the track are simply cut off by the
  track's own overflow, which is the honest signal that the row continues.
*/

.team__card-media {
  --media-cut: 1rem;

  flex: 0 0 auto;
  inline-size: clamp(8rem, 22vw, 11rem);
  overflow: hidden;
}

.team__card-image {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  background: var(--color-bg-raised);
}

.team__card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-inline-end: var(--space-3);
}

.team__name {
  margin-block-end: var(--space-2);
}

/* ---------------------------------------------------------------------
   Arrows.
--------------------------------------------------------------------- */
.team__controls {
  display: flex;
  gap: var(--space-3);
  margin-block-start: var(--space-6);
}

.team__arrow {
  display: grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  padding: 0;
  border: 1px solid var(--color-border-strong);
  border-radius: 999px;
  background: none;
  color: var(--color-text);
  cursor: pointer;
  transition:
    background-color var(--motion-duration-fast) var(--motion-ease),
    color var(--motion-duration-fast) var(--motion-ease);
}

.team__arrow:hover:not(:disabled) {
  background: var(--color-bg-inverse);
  color: var(--color-text-on-dark);
}

/* Disabled rather than wrapping: at the ends of a seven-card row, silently
   jumping back to the far end reads as a glitch. */
.team__arrow:disabled {
  opacity: 0.35;
  cursor: default;
}

.team__arrow:focus-visible {
  border-radius: 999px;
}

.team__arrow svg {
  inline-size: 1.125rem;
  block-size: 1.125rem;
}

/* The arrows point along the reading direction, so the glyphs swap sides
   under RTL rather than pointing backwards. The play/pause glyphs are not
   directional and must not be flipped with them. */
html[dir="rtl"] .team__arrow:not(.team__arrow--play) svg {
  transform: scaleX(-1);
}

/* Set apart from the pair it sits beside: the arrows step through the row,
   this governs whether the row moves at all. */
.team__arrow--play {
  margin-inline-start: var(--space-3);
}

@media (max-width: 639px) {
  .team__card {
    flex-direction: column;
  }

  .team__card-media {
    inline-size: 100%;
  }

  .team__card-body {
    padding-inline-end: 0;
  }
}
</style>
