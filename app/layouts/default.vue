<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="app-shell">
    <a
      href="#main-content"
      class="skip-link"
    >{{ t('nav.skipToContent') }}</a>
    <AppHeader />
    <main
      id="main-content"
      class="app-main"
      tabindex="-1"
    >
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-block-size: 100vh;
}

.app-main {
  flex: 1;
}

.app-main:focus-visible {
  outline: none;
}
</style>
