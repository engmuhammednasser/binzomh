<script setup lang="ts">
const { t } = useI18n()
const { current } = useAdminNav()
</script>

<template>
  <header class="admin__topbar">
    <p class="admin__breadcrumb">
      <span>{{ t('admin.title') }}</span>
      <span aria-hidden="true">/</span>
      <span class="admin__current">{{ current }}</span>
    </p>
    <div class="admin__tools">
      <span class="admin__prototype-badge">{{ t('admin.prototypeBadge') }}</span>
      <LanguageSwitcher />
    </div>
  </header>
</template>

<style scoped>
.admin__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-block-size: 76px;
  padding: 1rem clamp(1rem, 3vw, 3rem);
  border-block-end: 1px solid var(--color-border);
}

.admin__breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.admin__current {
  color: var(--color-text);
}

.admin__tools {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.admin__prototype-badge {
  padding: 0.2rem 0.625rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  white-space: nowrap;
}

@media (max-width: 540px) {
  .admin__breadcrumb > span:not(:last-child),
  .admin__prototype-badge { display: none; }

  .admin__topbar {
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    min-block-size: auto;
    padding-block: 0.875rem;
  }

  .admin__tools {
    margin-inline-start: auto;
  }
}
</style>
