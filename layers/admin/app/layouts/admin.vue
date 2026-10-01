<script setup lang="ts">
import '../assets/admin-workspace.css'

useAdminMessages()

const { t } = useI18n()
const { load } = useAdminWorkspace()
await load()
await useAdminEnquiries().refresh()

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
</script>

<template>
  <div class="admin">
    <a
      href="#admin-main"
      class="skip-link"
    >{{ t('nav.skipToContent') }}</a>

    <AdminShellRail />

    <div class="admin__body">
      <AdminShellTopbar />

      <main
        id="admin-main"
        class="admin__main"
        tabindex="-1"
      >
        <slot />
      </main>

      <AdminWorkspaceBar />
    </div>
  </div>
</template>

<style scoped>
.admin {
  display: grid;
  grid-template-columns: 14.5rem minmax(0, 1fr);
  min-block-size: 100svh;
  background: var(--color-bg-alt);
}

.admin__body {
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
}

.admin__main {
  flex: 1;
  inline-size: 100%;
  max-inline-size: 1440px;
  margin-inline: auto;
  padding: clamp(1rem, 2.5vw, 2rem);
}

.admin__main:focus-visible {
  outline: none;
}

@media (max-width: 1000px) {
  .admin {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
