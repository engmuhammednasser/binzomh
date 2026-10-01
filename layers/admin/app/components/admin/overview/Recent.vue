<script setup lang="ts">
/** The four newest enquiries, each linking straight to its detail. */
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { enquiries } = useAdminEnquiries()

const recent = computed(() => [...enquiries.value]
  .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
  .slice(0, 4),
)
</script>

<template>
  <section
    class="admin-panel recent"
    aria-labelledby="recent-heading"
  >
    <div class="admin-section-head">
      <div>
        <h2 id="recent-heading">
          {{ t('admin.overview.recent') }}
        </h2>
        <p>{{ t('admin.overview.recentIntro') }}</p>
      </div>
      <NuxtLink
        :to="localePath('/admin/enquiries')"
        class="admin-link"
      >
        {{ t('admin.overview.viewAll') }}<AdminIcon name="arrow" />
      </NuxtLink>
    </div>
    <ul class="recent__list">
      <li
        v-for="item in recent"
        :key="item.id"
      >
        <NuxtLink
          :to="localePath({ path: '/admin/enquiries', query: { id: item.id }, hash: '#enquiry-detail' })"
          class="recent__row"
        >
          <span
            class="recent__avatar"
            :class="{ 'recent__avatar--new': item.status === 'new' }"
            aria-hidden="true"
          >{{ item.name.slice(0, 1) }}</span>
          <span class="recent__content">
            <span
              class="recent__name"
              dir="auto"
            >{{ item.name }}</span>
            <span
              class="recent__preview"
              dir="auto"
            >{{ item.message }}</span>
            <time :datetime="item.receivedAt">{{ formatReceived(item.receivedAt, locale) }}</time>
          </span>
          <AdminStatus :status="item.status" />
        </NuxtLink>
      </li>
    </ul>
    <div
      v-if="!recent.length"
      class="recent__empty"
    >
      <span class="recent__empty-icon"><AdminIcon name="inbox" /></span>
      <div>
        <h3>{{ t('admin.overview.readyTitle') }}</h3><p>{{ t('admin.overview.readyHint') }}</p>
        <NuxtLink
          :to="localePath({ path: '/admin/enquiries', query: { create: '1' } })"
          class="admin-link"
        >{{ t('admin.live.addEnquiry') }}<AdminIcon name="arrow" /></NuxtLink>
      </div>
    </div>
    <div class="recent__foot">
      <span
        class="recent__dot"
        aria-hidden="true"
      />
      {{ t('admin.enquiries.sampleNote') }}
    </div>
  </section>
</template>

<style scoped>
.recent__empty { display: flex; align-items: flex-start; gap: 1rem; padding: 1.5rem; }
.recent__empty-icon { display: grid; place-items: center; min-inline-size: 42px; block-size: 42px; border-radius: 12px; background: var(--admin-success-bg); color: var(--admin-accent); }
.recent__empty h3 { margin: 0; font-size: .9375rem; }
.recent__empty p { color: var(--color-text-muted); font-size: .8125rem; margin: .4rem 0 0; max-inline-size: 28rem; }
.recent__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.recent__list > li + li {
  border-block-start: 1px solid var(--color-border);
}

.recent__row {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1.25rem 1.5rem;
  text-decoration: none;
  color: var(--color-text);
}

.recent__row:hover {
  background: var(--color-bg-raised);
}

.recent__avatar {
  display: grid;
  place-items: center;
  flex: 0 0 38px;
  block-size: 38px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg-raised);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.recent__avatar--new {
  color: var(--admin-accent);
  border-color: var(--admin-success-border);
  background: var(--admin-success-bg);
}

.recent__content {
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
  flex: 1;
  gap: 0.3rem;
}

.recent__name {
  font-weight: 600;
  font-size: 0.875rem;
}

.recent__preview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.recent__content time {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.recent__row > .admin-status {
  margin-block-start: 0.125rem;
}

.recent__foot {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-block-start: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.recent__dot {
  flex: 0 0 5px;
  block-size: 5px;
  border-radius: 50%;
  background: var(--color-text-muted);
}

@media (max-width: 600px) {
  .recent__row {
    padding: 1rem;
    gap: 0.75rem;
  }

  .recent__avatar {
    display: none;
  }

  .recent__foot {
    padding-inline: 1rem;
  }
}
</style>
