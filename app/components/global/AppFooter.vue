<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const siteName = useSiteName()
const navItems = useNavItems()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <MotionZDivider />
    <div class="app-footer__surface surface-inverse">
      <BaseContainer class="app-footer__inner">
        <div class="app-footer__top">
          <NuxtLink
            :to="localePath('/')"
            class="app-footer__brand"
          >
            <BaseLogo
              variant="light"
              size="2.25rem"
            />
          </NuxtLink>
          <LanguageSwitcher on-dark />
        </div>

        <nav
          class="app-footer__nav"
          :aria-label="t('nav.mainNavigation')"
        >
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="localePath(item.to)"
            class="app-footer__link"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <p class="text-small app-footer__tagline">
          {{ t('footer.tagline') }}
        </p>

        <div class="app-footer__bottom">
          <p class="text-small app-footer__copyright">
            © {{ year }} {{ siteName }}. {{ t('footer.rights') }}
          </p>
        </div>
      </BaseContainer>
    </div>
  </footer>
</template>

<style scoped>
.app-footer__inner {
  padding-block: clamp(var(--space-9), 8vw, var(--space-10));
  display: flex;
  flex-direction: column;
  gap: var(--space-7);
}

.app-footer__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
  flex-wrap: wrap;
}

.app-footer__nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5) var(--space-7);
  padding-block: var(--space-6);
  border-block: 1px solid var(--color-text-on-dark-muted);
}

.app-footer__link {
  font-size: var(--font-size-small);
  font-weight: 500;
  text-decoration: none;
  color: var(--color-text-on-dark);
}

.app-footer__link:hover {
  text-decoration: underline;
}

.app-footer__tagline {
  color: var(--color-text-on-dark-muted);
  max-inline-size: 30rem;
}

.app-footer__bottom {
  padding-block-start: var(--space-2);
}

.app-footer__copyright {
  color: var(--color-text-on-dark-muted);
}
</style>
