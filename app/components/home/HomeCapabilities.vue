<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { HomeCapabilitiesContent } from '~~/types/content'

defineProps<{ content: HomeCapabilitiesContent }>()

const activeIndex = ref(0)
const rowEls = ref<HTMLElement[]>([])
const prefersReduced = usePrefersReducedMotion()

function setRowRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (el instanceof HTMLElement) rowEls.value[index] = el
}

/**
 * One real photo per capability row (public/images/home/capabilities-1/2/3),
 * shown as a crossfade rather than swapping the <img> src — all three stay
 * mounted and opacity-toggled, so switching between them is instant with no
 * re-fetch or blank-frame flash.
 */
const VISUAL_COUNT = 3

let autoplayTimer: ReturnType<typeof setInterval> | undefined
let mobileQuery: MediaQueryList | undefined

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = undefined
  }
}

function startAutoplay() {
  stopAutoplay()
  if (prefersReduced.value) return
  autoplayTimer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % VISUAL_COUNT
  }, 3500)
}

// Autoplay only stands in for the desktop hover/scroll interaction on
// touch/mobile widths, where there's no hover and no sticky scroll-tied
// panel to react to — desktop keeps the row-linked behavior instead, so
// autoplay stays off there even if prefers-reduced-motion changes.
function syncAutoplay() {
  if (mobileQuery?.matches) startAutoplay()
  else stopAutoplay()
}

onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 1023px)')
  syncAutoplay()
  mobileQuery.addEventListener('change', syncAutoplay)
  onScopeDispose(() => {
    mobileQuery?.removeEventListener('change', syncAutoplay)
    stopAutoplay()
  })

  if (typeof IntersectionObserver === 'undefined') return

  // A thin horizontal band near the vertical center of the viewport, not a
  // forced scroll position — the browser's own scroll stays untouched
  // (no scroll hijacking). Whichever row's rows crosses that band becomes
  // "active" and swaps the sticky visual on desktop. Hovering a row (see
  // the template) does the same thing immediately, without waiting for
  // that band to be crossed.
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter(entry => entry.isIntersecting)
      if (visible.length === 0) return

      const closest = visible.reduce((best, entry) =>
        Math.abs(entry.boundingClientRect.top) < Math.abs(best.boundingClientRect.top) ? entry : best)

      const index = rowEls.value.indexOf(closest.target as HTMLElement)
      if (index !== -1) activeIndex.value = index
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
  )

  rowEls.value.forEach(el => observer.observe(el))
  onScopeDispose(() => observer.disconnect())
})

watch(prefersReduced, syncAutoplay)
</script>

<template>
  <section class="capabilities surface-alt">
    <BaseContainer class="stack-section">
      <MotionReveal class="capabilities__head">
        <p class="text-label text-muted">
          {{ content.eyebrow }}
        </p>
        <h2 class="text-h1 capabilities__heading">
          {{ content.heading }}
        </h2>
        <p class="text-body-lg text-muted capabilities__intro">
          {{ content.intro }}
        </p>
      </MotionReveal>

      <!--
        Real corporate photography: one photo per capability row
        (public/images/home/capabilities-1/2/3.png), replacing the
        "geometric" abstract treatment EditorialVisual used to render
        here. All three stay mounted in the frame below and crossfade via
        opacity based on activeIndex — an instant swap, no re-fetch, no
        blank-frame flash. AVIF/WebP + PNG fallback, 480w/960w generated
        from each 1122x1402 source — never upscaled.

        Desktop: activeIndex is driven by scrolling a row into the sticky
        band (the existing IntersectionObserver below, unchanged) *or* by
        hovering a row directly (see @mouseenter on .capability-row) —
        hover reacts immediately, scroll remains the fallback for
        keyboard/no-mouse navigation. Mobile/tablet: there's no hover and
        the panel isn't sticky there, so it autoplays instead (see
        startAutoplay/syncAutoplay in the script), cycling every 3.5s —
        off entirely under prefers-reduced-motion.

        One shared block (not a separate mobile copy) — CSS repositions
        it above the rows on mobile via `order`, so there's only ever one
        set of three images in the DOM, not two.
      -->
      <div class="capabilities__grid">
        <div class="capabilities__rows">
          <div
            v-for="(item, index) in content.items"
            :key="item.number"
            :ref="(el) => setRowRef(el, index)"
            class="capability-row"
            :class="{ 'is-active': activeIndex === index }"
            @mouseenter="activeIndex = index"
          >
            <MotionReveal :delay="index * 90">
              <span class="capability-row__number">{{ item.number }}</span>
              <h3 class="text-h2 capability-row__title">
                {{ item.title }}
              </h3>
              <p class="text-body-lg text-muted capability-row__description">
                {{ item.description }}
              </p>
            </MotionReveal>
          </div>
        </div>

        <div class="capabilities__visual">
          <div class="capabilities__visual-frame">
            <picture
              v-for="n in VISUAL_COUNT"
              :key="n"
              class="capabilities__visual-picture"
              :class="{ 'is-active': activeIndex === n - 1 }"
            >
              <source
                type="image/avif"
                :srcset="`/images/home/capabilities-${n}-480.avif 480w, /images/home/capabilities-${n}-960.avif 960w`"
                sizes="(max-width: 1023px) 22rem, 500px"
              >
              <source
                type="image/webp"
                :srcset="`/images/home/capabilities-${n}-480.webp 480w, /images/home/capabilities-${n}-960.webp 960w`"
                sizes="(max-width: 1023px) 22rem, 500px"
              >
              <img
                :src="`/images/home/capabilities-${n}.png`"
                width="1122"
                height="1402"
                alt=""
                aria-hidden="true"
                class="capabilities__visual-image"
                loading="lazy"
                decoding="async"
              >
            </picture>
            <p class="capabilities__visual-caption text-label">
              {{ content.items[activeIndex]?.title }}
            </p>
          </div>
        </div>
      </div>

      <MotionReveal
        v-if="content.cta"
        :delay="content.items.length * 90"
      >
        <BaseButton
          :to="content.cta.to"
          variant="secondary"
        >
          {{ content.cta.label }}
        </BaseButton>
      </MotionReveal>
    </BaseContainer>
  </section>
</template>

<style scoped>
.capabilities__head {
  margin-block-end: var(--space-8);
}

.capabilities__heading {
  margin-block: var(--space-4);
}

.capabilities__intro {
  max-inline-size: 34rem;
}

.capabilities__grid {
  display: flex;
  gap: var(--space-8);
  align-items: flex-start;
  margin-block-end: var(--space-8);
}

.capabilities__rows {
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
}

.capability-row {
  position: relative;
  padding-block: var(--space-8);
  padding-inline-start: var(--space-6);
  border-block-start: 1px solid var(--color-border);
}

.capability-row:first-child {
  border-block-start: none;
}

.capability-row::before {
  content: '';
  position: absolute;
  inset-block: var(--space-8) 0;
  inset-inline-start: 0;
  inline-size: 3px;
  background: var(--color-border);
  transition: background var(--motion-duration-base) var(--motion-ease);
}

.capability-row.is-active::before {
  background: var(--gradient-silver);
}

.capability-row__number {
  display: block;
  font-size: var(--font-size-h2);
  font-weight: 600;
  line-height: 1;
  color: var(--color-border-strong);
  transition: color var(--motion-duration-base) var(--motion-ease);
}

.capability-row.is-active .capability-row__number {
  color: var(--color-text);
}

.capability-row__title {
  margin-block: var(--space-3);
  transition: color var(--motion-duration-base) var(--motion-ease);
}

.capability-row.is-active .capability-row__title {
  color: var(--color-text);
}

.capability-row__description {
  max-inline-size: 30rem;
}

.capabilities__visual {
  flex: 1 1 46%;
  position: sticky;
  inset-block-start: calc(var(--space-8) + var(--space-2));
  align-self: flex-start;
}

/* Same frame language as the Hero and About visuals: a hairline edge and
   a soft lifted shadow, sized to the source's own 1122:1402 ratio. The
   three <picture> children are stacked absolutely inside it and
   crossfade via opacity — object-fit: contain on each keeps the full
   shot visible with no cropping. */
.capabilities__visual-frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1122 / 1402;
  border-radius: var(--radius-md);
  border: 1px solid rgb(17 17 17 / 0.06);
  box-shadow: 0 24px 48px -28px rgb(17 17 17 / 0.28);
}

.capabilities__visual-picture {
  position: absolute;
  inset: 0;
  display: block;
  opacity: 0;
  z-index: 1;
  transition: opacity var(--motion-duration-slow) var(--motion-ease);
}

/* Explicit z-index (not DOM order) on the active picture, so whichever
   image is fading in always sits above whichever is fading out —
   correct regardless of which direction activeIndex jumps (hover and
   autoplay don't always move forward). */
.capabilities__visual-picture.is-active {
  opacity: 1;
  z-index: 2;
}

.capabilities__visual-image {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
  background: var(--color-bg-raised);
}

/* A solid label chip rather than text laid directly over the photo — the
   images' own content varies too much in brightness edge-to-edge (bright
   sky and floor, dark warehouse interior) for plain overlaid text to stay
   reliably legible everywhere the caption could land. */
.capabilities__visual-caption {
  position: absolute;
  inset-block-end: var(--space-4);
  inset-inline-start: var(--space-4);
  z-index: 3;
  padding: var(--space-2) var(--space-4);
  background: var(--color-bg);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 1023px) {
  .capabilities__grid {
    flex-direction: column;
  }

  .capabilities__visual {
    /* Not sticky here — on mobile this sits once, above the rows
       (order: -1), rather than pinning itself while you scroll past
       them the way the desktop panel does. */
    position: static;
    order: -1;
    inline-size: 100%;
    max-inline-size: 22rem;
    margin-inline: auto;
    margin-block-end: var(--space-6);
  }
}
</style>
