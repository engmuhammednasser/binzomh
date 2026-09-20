<script setup lang="ts">
interface NavItem {
  label: string
  to: string
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

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return
    await nextTick()
    const firstLink = panel.value?.querySelector('a')
    ;(firstLink as HTMLElement | null)?.focus()
  },
)

function getFocusable(): HTMLElement[] {
  if (!dialog.value) return []
  return Array.from(
    dialog.value.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])'),
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
      @keydown="onKeydown"
    >
      <button
        type="button"
        class="mobile-nav__backdrop"
        :aria-label="$t('nav.closeMenu')"
        @click="emit('close')"
      />
      <nav
        id="mobile-nav"
        ref="panel"
        class="mobile-nav__panel"
        :aria-label="$t('nav.mainNavigation')"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="localePath(item.to)"
          class="mobile-nav__link"
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
}

.mobile-nav__link {
  padding-block: var(--space-3);
  font-size: var(--font-size-body-lg);
  text-decoration: none;
  border-block-end: 1px solid var(--color-border);
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
