<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { HomeCapabilitiesContent } from '~~/types/content'

defineProps<{ content: HomeCapabilitiesContent }>()

const activeIndex = ref(0)
const rowEls = ref<HTMLElement[]>([])

function setRowRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (el instanceof HTMLElement) rowEls.value[index] = el
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') return

  // A thin horizontal band near the vertical center of the viewport, not a
  // forced scroll position — the browser's own scroll stays untouched
  // (no scroll hijacking). Whichever row's rows crosses that band becomes
  // "active" and swaps the sticky visual on desktop.
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

      <div class="capabilities__grid">
        <div class="capabilities__rows">
          <div
            v-for="(item, index) in content.items"
            :key="item.number"
            :ref="(el) => setRowRef(el, index)"
            class="capability-row"
            :class="{ 'is-active': activeIndex === index }"
          >
            <MotionReveal :delay="index * 90">
              <span class="text-label capability-row__number">{{ item.number }}</span>
              <h3 class="text-h3 capability-row__title">
                {{ item.title }}
              </h3>
              <p class="text-body-lg text-muted capability-row__description">
                {{ item.description }}
              </p>
              <div class="capability-row__visual capability-row__visual--mobile">
                <!-- No caption here — the row's own heading right above
                     already names this capability; repeating it on the
                     decorative visual would just be visual noise. -->
                <HomeEditorialVisual
                  :variant="index"
                  aspect="16 / 10"
                />
              </div>
            </MotionReveal>
          </div>
        </div>

        <div class="capabilities__visual">
          <HomeEditorialVisual
            :variant="activeIndex"
            :caption="content.items[activeIndex]?.title"
            aspect="4 / 5"
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
  flex: 1 1 56%;
  display: flex;
  flex-direction: column;
}

.capability-row {
  position: relative;
  padding-block: var(--space-7);
  padding-inline-start: var(--space-5);
  border-block-start: 1px solid var(--color-border);
  transition: opacity var(--motion-duration-base) var(--motion-ease);
}

.capability-row:first-child {
  border-block-start: none;
}

.capability-row::before {
  content: '';
  position: absolute;
  inset-block: var(--space-7) 0;
  inset-inline-start: 0;
  inline-size: 2px;
  background: var(--color-border);
  transition: background var(--motion-duration-base) var(--motion-ease);
}

.capability-row.is-active::before {
  background: var(--gradient-silver);
}

.capability-row__number {
  color: var(--color-text-subtle);
}

.capability-row.is-active .capability-row__number {
  color: var(--color-text);
}

.capability-row__title {
  margin-block: var(--space-2) var(--space-3);
}

.capability-row__description {
  max-inline-size: 30rem;
}

.capability-row__visual--mobile {
  display: none;
}

.capabilities__visual {
  flex: 1 1 40%;
  position: sticky;
  inset-block-start: calc(var(--space-8) + var(--space-2));
  align-self: flex-start;
}

@media (max-width: 1023px) {
  .capabilities__grid {
    flex-direction: column;
  }

  .capabilities__visual {
    display: none;
  }

  .capability-row__visual--mobile {
    display: block;
    margin-block-start: var(--space-5);
  }
}
</style>
