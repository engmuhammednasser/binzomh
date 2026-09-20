<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const siteName = useSiteName()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <MotionZDivider />
    <div class="app-footer__surface surface-inverse">
      <BaseContainer class="app-footer__inner">
        <NuxtLink
          :to="localePath('/')"
          class="app-footer__brand"
        >
          <BaseLogo variant="light" />
        </NuxtLink>
        <p class="text-small app-footer__tagline">
          {{ t('footer.tagline') }}
        </p>
        <p class="text-small app-footer__tagline">
          © {{ year }} {{ siteName }}. {{ t('footer.rights') }}
        </p>
      </BaseContainer>
    </div>
  </footer>
</template>

<style scoped>
.app-footer__inner {
  padding-block: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.app-footer__tagline {
  color: var(--color-text-on-dark-muted);
  max-inline-size: 30rem;
}
</style>
