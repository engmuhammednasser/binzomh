<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { HomeCapabilitiesContent } from '~~/types/content'
import { frameAspect } from '~~/shared/utils/site-image'

const { slotFor } = useManagedSite()

const props = defineProps<{ content: HomeCapabilitiesContent }>()

const siteImage = useSiteImage()
const capabilitySlots = computed(() => props.content.items.map(item => ({
  id: item.id,
  slot: slotFor(item.imageSlotId),
})))

const activeIndex = ref(0)
const rowEls = ref<HTMLElement[]>([])
const visual = ref<HTMLElement | null>(null)
const isMobile = ref(false)
const { canAnimate, running, paused, toggle } = useMotionPlayback(visual)

function setRowRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (el instanceof HTMLElement) rowEls.value[index] = el
}

let autoplayTimer: ReturnType<typeof setInterval> | undefined

function syncAutoplay() {
  clearInterval(autoplayTimer)
  if (!running.value || !isMobile.value || props.content.items.length < 2) return
  autoplayTimer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % props.content.items.length
  }, 3500)
}

watch([running, isMobile, () => props.content.items.length], () => {
  activeIndex.value = Math.min(activeIndex.value, Math.max(0, props.content.items.length - 1))
  syncAutoplay()
})
onScopeDispose(() => clearInterval(autoplayTimer))

onMounted(() => {
  const mobileQuery = window.matchMedia('(max-width: 1023px)')
  const syncViewport = () => {
    isMobile.value = mobileQuery.matches
  }
  syncViewport()
  mobileQuery.addEventListener('change', syncViewport)
  onScopeDispose(() => mobileQuery.removeEventListener('change', syncViewport))

  if (typeof IntersectionObserver === 'undefined') return

  // A thin horizontal band near the vertical center of the viewport, not a
  // forced scroll position — the browser's own scroll stays untouched
  // (no scroll hijacking). Whichever row's rows crosses that band becomes
  // "active" and swaps the sticky visual on desktop. Hovering a row (see
  // the template) does the same thing immediately, without waiting for
  // that band to be crossed.
  const observer = new IntersectionObserver(
    (entries) => {
      if (isMobile.value) return
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

      <!-- Stable content IDs keep each image attached to its capability when reordered. -->
      <div class="capabilities__grid">
        <div class="capabilities__rows">
          <div
            v-for="(item, index) in content.items"
            :key="item.id"
            :ref="(el) => setRowRef(el, index)"
            class="capability-row"
            :class="{ 'is-active': activeIndex === index }"
            @mouseenter="!isMobile && (activeIndex = index)"
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

        <div
          ref="visual"
          class="capabilities__visual"
        >
          <div class="capabilities__visual-frame media-frame">
            <template
              v-for="({ id, slot }, i) in capabilitySlots"
              :key="id"
            >
              <picture
                v-if="slot?.image"
                class="capabilities__visual-picture"
                :class="{ 'is-active': activeIndex === i }"
              >
                <source
                  v-for="source in siteImage.sources(slot.image)"
                  :key="source.type"
                  :type="source.type"
                  :srcset="source.srcset"
                  sizes="(max-width: 1023px) 22rem, 500px"
                >
                <img
                  :src="siteImage.src(slot.image)"
                  :width="slot.image.width"
                  :height="slot.image.height"
                  :alt="siteImage.alt(slot.image)"
                  aria-hidden="true"
                  class="capabilities__visual-image"
                  loading="lazy"
                  decoding="async"
                >
              </picture>
              <HomeEditorialVisual
                v-else
                class="capabilities__visual-picture"
                :class="{ 'is-active': activeIndex === i }"
                treatment="photography"
                :aspect="frameAspect(slot?.frame ?? { width: 4, height: 5 })"
              />
            </template>
            <p class="capabilities__visual-caption text-label">
              {{ content.items[activeIndex]?.title }}
            </p>
          </div>
          <MotionPlaybackButton
            v-if="canAnimate && isMobile && content.items.length > 1"
            :paused="paused"
            @toggle="toggle"
          />
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
