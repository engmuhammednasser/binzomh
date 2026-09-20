<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const mobileOpen = ref(false)
const toggleButton = ref<HTMLButtonElement | null>(null)

const navItems = computed(() => [
  { label: t('nav.home'), to: '/' },
  { label: t('nav.about'), to: '/about' },
  { label: t('nav.brands'), to: '/brands' },
  { label: t('nav.capabilities'), to: '/capabilities' },
  { label: t('nav.network'), to: '/network' },
  { label: t('nav.contact'), to: '/contact' },
])

function closeMobile() {
  const wasOpen = mobileOpen.value
  mobileOpen.value = false
  if (wasOpen) {
    nextTick(() => toggleButton.value?.focus())
  }
}
</script>

<template>
  <header class="app-header">
    <BaseContainer class="app-header__inner">
      <NuxtLink
        :to="localePath('/')"
        class="app-header__brand"
        @click="closeMobile"
      >
        <BaseLogo variant="dark" />
      </NuxtLink>

      <nav
        class="app-header__nav"
        :aria-label="t('nav.mainNavigation')"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="localePath(item.to)"
          class="app-header__link"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="app-header__actions">
        <LanguageSwitcher class="app-header__language" />
        <button
          ref="toggleButton"
          type="button"
          class="app-header__toggle"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-nav"
          @click="mobileOpen = !mobileOpen"
        >
          <span class="visually-hidden">{{ mobileOpen ? t('nav.closeMenu') : t('nav.openMenu') }}</span>
          <span
            class="app-header__toggle-bars"
            aria-hidden="true"
          />
        </button>
      </div>
    </BaseContainer>

    <MobileNav
      :open="mobileOpen"
      :items="navItems"
      @close="closeMobile"
    />
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 50;
  background: var(--color-bg);
  border-block-end: 1px solid var(--color-border);
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-block: var(--space-4);
}

.app-header__nav {
  display: none;
  align-items: center;
  gap: var(--space-6);
}

.app-header__link {
  font-size: var(--font-size-small);
  text-decoration: none;
}

.app-header__link:hover {
  text-decoration: underline;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.app-header__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 44px;
  block-size: 44px;
  border-radius: var(--radius-sm);
}

.app-header__toggle-bars {
  position: relative;
  display: block;
  inline-size: 22px;
  block-size: 2px;
  background: currentColor;
}

.app-header__toggle-bars::before,
.app-header__toggle-bars::after {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  inline-size: 100%;
  block-size: 2px;
  background: currentColor;
}

.app-header__toggle-bars::before {
  inset-block-start: -6px;
}

.app-header__toggle-bars::after {
  inset-block-start: 6px;
}

@media (min-width: 768px) {
  .app-header__nav {
    display: flex;
  }

  .app-header__toggle {
    display: none;
  }
}
</style>
