<script setup lang="ts">
/** Counts for the content libraries that change rarely: team, logos. */
defineProps<{ teamCount: number, logoCount: number }>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section
    class="inventory"
    :aria-label="t('admin.overview.library')"
  >
    <NuxtLink
      :to="localePath({ path: '/admin/team', hash: '#team-members' })"
      class="inventory__item"
    >
      <span class="inventory__icon"><AdminIcon name="team" /></span>
      <span class="inventory__text"><strong>{{ t('admin.overview.teamMembers') }}</strong><span>{{ t('admin.overview.teamHint') }}</span></span>
      <span class="inventory__number">{{ teamCount }}</span>
      <AdminIcon name="arrow" />
    </NuxtLink>
    <NuxtLink
      :to="localePath({ path: '/admin/team', hash: '#partner-logos' })"
      class="inventory__item"
    >
      <span class="inventory__icon"><AdminIcon name="image" /></span>
      <span class="inventory__text"><strong>{{ t('admin.overview.partnerLogos') }}</strong><span>{{ t('admin.overview.logosHint') }}</span></span>
      <span class="inventory__number">{{ logoCount }}</span>
      <AdminIcon name="arrow" />
    </NuxtLink>
  </section>
</template>

<style scoped>
.inventory {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
  margin-block-start: 1.5rem;
}

.inventory__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  text-decoration: none;
}

.inventory__item:hover {
  background: var(--color-bg);
}

.inventory__icon {
  display: grid;
  place-items: center;
  inline-size: 44px;
  block-size: 44px;
  flex-shrink: 0;
  background: var(--color-bg-raised);
  border-radius: 10px;
  color: var(--color-text-muted);
}

.inventory__text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-inline-size: 0;
  flex: 1;
}

.inventory__text strong {
  font-weight: 600;
  font-size: 0.875rem;
}

.inventory__text > span {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.inventory__number {
  font-size: 1.75rem;
  font-weight: 500;
}

.inventory__item > .admin-icon {
  color: var(--color-text-muted);
  inline-size: 16px;
}

@media (max-width: 600px) {
  .inventory {
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
  }

  .inventory__item {
    padding: 1rem;
    gap: 0.75rem;
  }
}
</style>
