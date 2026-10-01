<script setup lang="ts">
defineProps<{ heading: string, intro?: string }>()
</script>

<template>
  <header class="admin-page-header">
    <div>
      <h1 class="text-h2 admin-page-header__heading">
        {{ heading }}
      </h1>
      <p
        v-if="intro"
        class="text-muted admin-page-header__intro"
      >
        {{ intro }}
      </p>
    </div>
    <div
      v-if="$slots.actions"
      class="admin-page-header__actions"
    >
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.admin-page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-block-end: 1.5rem;
}

.admin-page-header__heading {
  margin: 0;
}

.admin-page-header__intro {
  margin-block-start: var(--space-2);
  max-inline-size: 44rem;
  font-size: .875rem;
  margin-block-end: 0;
}

.admin-page-header__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}
</style>
