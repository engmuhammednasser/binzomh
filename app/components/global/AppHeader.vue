<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const mobileOpen = ref(false)
const toggleButton = ref<HTMLButtonElement | null>(null)

const navItems = useNavItems()

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
        <BaseLogo
          variant="dark"
          size="2.5rem"
        />
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
        <BaseButton
          :to="'/contact'"
          variant="primary"
          class="app-header__cta"
        >
          {{ t('nav.partnerCta') }}
        </BaseButton>
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
  box-shadow: 0 1px 0 var(--color-border), var(--shadow-sm);
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
  padding-block: clamp(var(--space-4), 1.4vw, var(--space-5));
}

.app-header__nav {
  display: none;
  align-items: center;
  gap: clamp(var(--space-6), 3vw, var(--space-7));
}

.app-header__link {
  position: relative;
  padding-block: var(--space-2);
  font-size: var(--font-size-small);
  font-weight: 500;
  text-decoration: none;
}

.app-header__link::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  inset-block-end: 0;
  block-size: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: inline-start;
  transition: transform var(--motion-duration-fast) var(--motion-ease);
}

.app-header__link:hover::after {
  transform: scaleX(1);
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-5);
}

.app-header__cta {
  display: none;
  padding-block: var(--space-2);
  font-size: var(--font-size-small);
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

@media (min-width: 1024px) {
  .app-header__cta {
    display: inline-flex;
  }
}
</style>
