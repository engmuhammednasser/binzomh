<script setup lang="ts">
import type { AdminEnquiry } from '../../../composables/useAdminEnquiries'

defineProps<{ items: AdminEnquiry[], selectedId?: string, searching?: boolean }>()
const emit = defineEmits<{ select: [id: string] }>()

const { t, locale } = useI18n()
</script>

<template>
  <ul class="list">
    <li
      v-for="item in items"
      :key="item.id"
    >
      <!--
        Sender text is visitor-written and may be in either language. The
        name sits in <bdi>: isolated in its own direction but aligned with
        the interface. The preview takes dir="auto" instead, so a clipped
        English line is cut at its own end, not its beginning.
      -->
      <button
        :id="`enquiry-row-${item.id}`"
        type="button"
        class="row"
        :class="{ 'is-selected': item.id === selectedId, 'is-new': item.status === 'new' }"
        :aria-current="item.id === selectedId ? 'true' : undefined"
        @click="emit('select', item.id)"
      >
        <span
          class="row__avatar"
          aria-hidden="true"
        >{{ item.name.slice(0, 1) }}</span>
        <span class="row__body">
          <span class="row__top">
            <bdi class="row__name">{{ item.name }}</bdi>
            <time
              class="row__time"
              :datetime="item.receivedAt"
            >{{ formatReceived(item.receivedAt, locale) }}</time>
          </span>
          <span class="row__bottom">
            <span
              class="row__preview"
              dir="auto"
            >{{ item.message }}</span>
            <span
              v-if="item.status === 'new'"
              class="row__dot"
            ><span class="visually-hidden">{{ t('admin.enquiries.unread') }}</span></span>
            <AdminStatus
              v-else
              :status="item.status"
              class="row__status"
            />
          </span>
        </span>
      </button>
    </li>
    <li
      v-if="!items.length"
      class="list__empty"
    >
      {{ t(searching ? 'admin.enquiries.noMatch' : 'admin.enquiries.empty') }}
    </li>
  </ul>
</template>

<style scoped>
.list {
  list-style: none;
  margin: 0;
  padding: 0.375rem;
}

.row {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  inline-size: 100%;
  padding: 0.75rem;
  border: 0;
  border-radius: 10px;
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
  transition: background-color var(--motion-duration-fast) var(--motion-ease);
}

.row:hover {
  background: rgb(255 255 255 / 0.04);
}

.row:focus-visible {
  outline-offset: -2px;
}

/* A raised fill and a leading bar, so the open row is marked by more than
   colour. */
.row.is-selected {
  background: var(--color-bg-raised);
}

.row.is-selected::before {
  content: '';
  position: absolute;
  inset-block: 0.75rem;
  inset-inline-start: 0;
  inline-size: 3px;
  border-radius: 3px;
  background: var(--admin-accent);
}

.row__avatar {
  display: grid;
  place-items: center;
  flex: 0 0 2.25rem;
  block-size: 2.25rem;
  border-radius: 50%;
  background: var(--color-bg-raised);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 600;
}

.row.is-new .row__avatar {
  background: var(--admin-success-bg);
  color: var(--admin-accent);
}

.row.is-selected .row__avatar {
  background: var(--color-bg);
}

.row__body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-inline-size: 0;
}

.row__top,
.row__bottom {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-inline-size: 0;
}

.row__name {
  flex: 1;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
}

.row.is-new .row__name {
  font-weight: 700;
}

.row__time {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}

.row__preview {
  flex: 1;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.row.is-new .row__preview {
  color: var(--color-text);
}

.row__dot {
  flex: 0 0 8px;
  block-size: 8px;
  border-radius: 50%;
  background: var(--admin-accent);
}

.row__status {
  flex-shrink: 0;
  font-size: 0.6875rem;
}

.list__empty {
  padding: 2rem 1rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  text-align: center;
}
</style>
