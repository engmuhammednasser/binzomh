<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const assetUrl = useAssetUrl()
const { items } = useAdminNav()
const { logout } = useAdminSession()
const { dirty, error } = useAdminWorkspace()
const signingOut = ref(false)
async function signOut() {
  if (dirty.value && !window.confirm(t('admin.live.leaveConfirm'))) return
  signingOut.value = true
  try {
    await logout()
  }
  catch {
    error.value = t('admin.live.failed')
    signingOut.value = false
  }
}
</script>

<template>
  <aside class="admin__rail">
    <NuxtLink
      :to="localePath('/admin')"
      class="admin__brand"
    >
      <BaseLogo
        variant="light"
        size="2rem"
      />
      <span class="admin__brand-label">{{ t('admin.workspace') }}</span>
    </NuxtLink>

    <nav
      class="admin__nav"
      :aria-label="t('admin.nav.label')"
    >
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="localePath(item.to)"
        class="admin__nav-link"
        active-class=""
        exact-active-class="is-active"
      >
        <AdminIcon :name="item.icon" />
        <span class="admin__nav-label">{{ item.label }}</span>
        <span
          v-if="item.badge"
          class="admin__badge"
        >{{ item.badge }}</span>
      </NuxtLink>
    </nav>

    <div class="admin__rail-foot">
      <p class="admin__team-label">
        {{ t('admin.teamSpace') }}
      </p>
      <NuxtLink
        :to="assetUrl(localePath('/') as `/${string}`)"
        external
        target="_blank"
        class="admin__rail-link"
      >
        <AdminIcon name="globe" />
        {{ t('admin.nav.viewSite') }}
        <AdminIcon
          name="arrow"
          class="admin__external-arrow"
        />
      </NuxtLink>
      <button
        type="button"
        class="admin__rail-link"
        :disabled="signingOut"
        @click="signOut"
      >
        <AdminIcon name="exit" />
        {{ t('admin.nav.signOut') }}
      </button>
    </div>
  </aside>
</template>

<style scoped>
.admin__rail {
  position: sticky;
  inset-block-start: 0;
  block-size: 100svh;
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
  padding: 2rem 1rem 1.25rem;
  overflow-y: auto;
  background: var(--admin-rail);
  border-inline-end: 1px solid var(--color-border);
}

.admin__brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
  padding-inline: 0.75rem;
  text-decoration: none;
}

.admin__brand-label,
.admin__team-label {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.admin__nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.admin__nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-block-size: 48px;
  padding: 0.75rem;
  border-radius: 9px;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  transition: background-color var(--motion-duration-fast) var(--motion-ease);
}

.admin__nav-label {
  flex: 1;
}

.admin__nav-link:hover {
  color: var(--color-text);
  background: var(--color-bg);
}

.admin__nav-link.is-active {
  color: var(--color-text-on-dark);
  background: var(--color-bg-inverse);
  font-weight: 700;
}

.admin__badge {
  min-inline-size: 1.5rem;
  padding: 0.0625rem 0.375rem;
  border-radius: 6px;
  background: var(--color-bg-raised);
  color: var(--color-text);
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: center;
}

.admin__rail-foot {
  margin-block-start: auto;
  padding-block-start: 1.25rem;
  border-block-start: 1px solid var(--color-border);
}

.admin__team-label {
  margin: 0 0 0.75rem;
  padding-inline: 0.75rem;
}

.admin__rail-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-block-size: 44px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  text-decoration: none;
  border-radius: 8px;
}

.admin__rail-link:hover {
  color: var(--color-text);
  background: var(--color-bg);
}

.admin__external-arrow {
  margin-inline-start: auto;
  inline-size: 16px;
}

@media (max-width: 1000px) {
  .admin__rail {
    position: static;
    block-size: auto;
    gap: 1.25rem;
    padding: 1.25rem 1rem 1rem;
  }

  .admin__brand {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
    padding: 0;
  }

  .admin__nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .admin__nav-link {
    flex: 1 0 auto;
    justify-content: center;
    padding: 0.625rem;
    min-block-size: 44px;
  }

  .admin__nav-label {
    flex: initial;
  }

  .admin__rail-foot {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-block-start: 0.5rem;
  }

  .admin__team-label {
    display: none;
  }

  .admin__rail-link {
    padding-inline: 0.375rem;
  }
}

@media (max-width: 540px) {
  .admin__rail {
    gap: 0.75rem;
  }

  .admin__nav {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-block: 0.25rem;
    scrollbar-width: thin;
  }

  .admin__nav-link {
    flex: 0 0 auto;
    font-size: 0.8125rem;
    gap: 0.5rem;
  }

  .admin__brand-label {
    max-inline-size: 9rem;
    text-align: end;
  }

  .admin__nav-link .admin-icon {
    inline-size: 18px;
  }
}
</style>
