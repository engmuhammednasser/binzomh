<script setup lang="ts">
/** The two things that need someone today: new enquiries, unready brands. */
defineProps<{ newCount: number, pendingBrands: number }>()

const { t } = useI18n()
const localePath = useLocalePath()
const { state, dirty, unpublished } = useAdminWorkspace()
</script>

<template>
  <section
    class="priorities"
    :aria-label="t('admin.overview.priorities')"
  >
    <NuxtLink
      :to="localePath({ path: '/admin/enquiries', query: { status: 'new' } })"
      class="priority priority--enquiries"
    >
      <div class="priority__head">
        <span class="priority__label"><AdminIcon name="inbox" />{{ t('admin.overview.newEnquiries') }}</span>
        <span class="priority__tag">{{ t('admin.overview.sampleData') }}</span>
      </div>
      <div class="priority__body">
        <strong class="priority__number">{{ newCount }}</strong>
        <span class="priority__description">{{ t(newCount ? 'admin.overview.awaitingReply' : 'admin.overview.inboxClear') }}</span>
      </div>
      <span class="priority__action">{{ t('admin.overview.openInbox') }}<AdminIcon name="arrow" /></span>
    </NuxtLink>

    <NuxtLink
      :to="localePath('/admin/brands')"
      class="priority priority--content"
    >
      <div class="priority__head">
        <span class="priority__label"><AdminIcon name="brands" />{{ t('admin.overview.contentReadiness') }}</span>
        <span class="priority__tag">{{ t('admin.overview.bothLanguages') }}</span>
      </div>
      <div class="priority__body">
        <strong class="priority__number">{{ pendingBrands }}</strong>
        <span class="priority__description">{{ t(pendingBrands ? 'admin.overview.brandsToReview' : 'admin.overview.contentReady') }}</span>
      </div>
      <span class="priority__action">{{ t('admin.overview.reviewContent') }}<AdminIcon name="arrow" /></span>
    </NuxtLink>
    <NuxtLink
      :to="localePath('/admin/pages')"
      class="priority priority--publication"
    >
      <div class="priority__head">
        <span class="priority__label"><AdminIcon name="globe" />{{ t('admin.overview.publication') }}</span>
      </div>
      <div class="priority__body priority__body--status">
        <strong
          class="priority__status"
          :class="{ 'priority__status--pending': dirty || unpublished }"
        >{{ t(dirty ? 'admin.live.unsavedShort' : unpublished ? 'admin.live.draftShort' : 'admin.live.liveShort') }}</strong>
        <span class="priority__description">{{ t('admin.live.savedVersion', { number: state?.revision ?? 0 }) }} · {{ t('admin.live.publishedVersion', { number: state?.publishedRevision ?? 0 }) }}</span>
      </div>
      <span class="priority__action">{{ t('admin.overview.continueEditing') }}<AdminIcon name="arrow" /></span>
    </NuxtLink>
  </section>
</template>

<style scoped>
.priorities {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  margin-block-end: 1.5rem;
}

.priority {
  display: flex;
  flex-direction: column;
  padding: 1.15rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  text-decoration: none;
  transition: border-color var(--motion-duration-fast) var(--motion-ease);
}

.priority--enquiries {
  background: linear-gradient(120deg, #283b37, #222d2d);
  border-color: #49635a;
}

.priority:hover {
  border-color: var(--color-text-muted);
}

.priority__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.priority__label {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  font-weight: 600;
}

.priority__tag {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.priority__body {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-block: 0.75rem;
}

.priority__number {
  font-size: 2.5rem;
  font-weight: 500;
  line-height: 1.25;
  font-variant-numeric: tabular-nums;
}

.priority__body--status { flex-direction: column; align-items: flex-start; justify-content: center; gap: .4rem; flex: 1; }
.priority__status { color: var(--admin-success); font-size: 1.25rem; font-weight: 600; }
.priority__status--pending { color: var(--admin-warning); }
.priority__tag { display: none; }

.priority__description {
  color: var(--color-text-muted);
  max-inline-size: 22rem;
  font-size: 0.875rem;
}

.priority__action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-block-start: auto;
  padding-block-start: 1rem;
  border-block-start: 1px solid var(--color-border);
  font-size: 0.875rem;
  font-weight: 600;
}

.priority--enquiries .priority__action {
  color: var(--admin-accent);
  border-color: #49635a;
}

@media (max-width: 760px) {
  .priorities {
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
  }

  .priority {
    padding: 1rem;
  }
  .priority__body { margin-block: .4rem; }
  .priority__action { padding-block-start: .65rem; }
}
</style>
