<script setup lang="ts">
interface NavItem {
  label: string
  to: string
  active: boolean
}

const props = defineProps<{
  open: boolean
  items: NavItem[]
}>()

const emit = defineEmits<{ close: [] }>()

const localePath = useLocalePath()
const route = useRoute()
const dialog = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)

watch(
  () => route.fullPath,
  () => emit('close'),
)

// Hold the page still behind the open menu, so a scroll gesture on the
// panel cannot move the reading position underneath it. The watcher only
// fires on a change of `open`, which never happens during SSR, so the
// document is only touched in the browser.
function lockPageScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

onBeforeUnmount(() => {
  if (props.open) lockPageScroll(false)
})

watch(
  () => props.open,
  async (isOpen) => {
    lockPageScroll(isOpen)
    if (!isOpen) return
    await nextTick()
    panel.value?.querySelector<HTMLButtonElement>('.mobile-nav__close')?.focus()
  },
)

function getFocusable(): HTMLElement[] {
  if (!dialog.value) return []
  return Array.from(
    dialog.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'),
  )
}

// Traps Tab/Shift+Tab inside the dialog so focus (and therefore this
// Escape handler, which relies on the event bubbling up from a focused
// descendant) never leaves it while open.
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
    return
  }

  if (event.key !== 'Tab') return

  const focusable = getFocusable()
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  }
  else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="dialog"
      class="mobile-nav"
      role="dialog"
      aria-modal="true"
      :aria-label="$t('nav.mainNavigation')"
      @keydown="onKeydown"
    >
      <button
        type="button"
        class="mobile-nav__backdrop"
        tabindex="-1"
        :aria-label="$t('nav.closeMenu')"
        @click="emit('close')"
      />
      <nav
        id="mobile-nav"
        ref="panel"
        class="mobile-nav__panel"
        :aria-label="$t('nav.mainNavigation')"
      >
        <button
          type="button"
          class="mobile-nav__close"
          @click="emit('close')"
        >
          <span aria-hidden="true">×</span>
          {{ $t('nav.closeMenu') }}
        </button>
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="localePath(item.to)"
          class="mobile-nav__link"
          :class="{ 'is-active': item.active }"
          @click="emit('close')"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </Teleport>
</template>

<style scoped>
.mobile-nav {
  position: fixed;
  inset: 0;
  z-index: 200;
}

.mobile-nav__backdrop {
  position: absolute;
  inset: 0;
  background: rgb(17 17 17 / 0.4);
  border: none;
  padding: 0;
}

.mobile-nav__panel {
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0;
  inline-size: min(20rem, 85vw);
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-8) var(--space-5);
  box-shadow: var(--shadow-sm);
  /* Its own scroll on short screens (a phone turned sideways), so the last
     links stay reachable; contain keeps that scroll from chaining out to
     the page once the panel reaches its end. */
  overflow-y: auto;
  overscroll-behavior: contain;
}

.mobile-nav__link {
  padding-block: var(--space-3);
  font-size: var(--font-size-body-lg);
  text-decoration: none;
  border-block-end: 1px solid var(--color-border);
}

.mobile-nav__close {
  min-block-size: 44px;
  align-self: flex-end;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding-inline: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.mobile-nav__link.is-active {
  font-weight: 700;
  border-block-end-color: currentColor;
}

@media (prefers-reduced-motion: no-preference) {
  .mobile-nav__panel {
    animation: mobile-nav-in var(--motion-duration-base) var(--motion-ease);
  }
}

@keyframes mobile-nav-in {
  from {
    transform: translateX(4%);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}

@keyframes mobile-nav-in-rtl {
  from {
    transform: translateX(-4%);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}

html[dir="rtl"] .mobile-nav__panel {
  animation-name: mobile-nav-in-rtl;
}
</style>
