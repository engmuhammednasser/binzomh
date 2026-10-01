<script setup lang="ts">
import { formatReceived } from '../../composables/useAdminEnquiries'

const { t, locale } = useI18n()
const { state, action, dirty, busy } = useAdminWorkspace()
const restore = ref<number | null>(null)
const expanded = ref(false)
const entries = computed(() => expanded.value ? state.value?.history : state.value?.history.slice(0, 3))
</script>

<template>
  <section class="admin-panel activity">
    <div class="admin-section-head">
      <h2>
        {{ t('admin.live.history') }}
      </h2>
    </div>
    <p
      v-if="!state?.history.length"
      class="text-muted"
    >
      {{ t('admin.live.noHistory') }}
    </p>
    <ol
      v-else
      class="activity__list"
    >
      <li
        v-for="entry in entries"
        :key="entry.id"
      >
        <div><strong>{{ t(`admin.live.${entry.action}Event`) }}</strong> <span>#{{ entry.id }}</span><br><time :datetime="entry.createdAt">{{ formatReceived(entry.createdAt, locale) }}</time></div>
        <span
          v-if="entry.id === state.revision"
          class="activity__current"
        >{{ t('admin.live.latest') }}</span>
        <button
          v-else
          class="admin-btn admin-btn--small"
          :disabled="dirty || busy || entry.id === state.revision"
          @click="restore = entry.id"
        >
          {{ t('admin.live.restore') }}
        </button>
      </li>
    </ol>
    <button
      v-if="(state?.history.length ?? 0) > 3"
      class="activity__expand"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      {{ expanded ? t('admin.live.lessHistory') : t('admin.live.allHistory', { count: state?.history.length }) }}
    </button>
    <div
      v-if="restore !== null"
      class="admin-panel activity__confirm"
    >
      <p>{{ t('admin.live.restoreConfirm', { number: restore }) }}</p>
      <button
        class="admin-btn"
        :disabled="busy || dirty"
        @click="action('restore', restore); restore = null"
      >
        {{ t('admin.live.restore') }}
      </button>
      <button
        class="admin-btn"
        @click="restore = null"
      >
        {{ t('admin.common.close') }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.activity__list { list-style: none; padding: 0 1.25rem; margin: 0; max-height: 21rem; overflow-y: auto; }
.activity__list li { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: .85rem 0; font-size: .8125rem; }
.activity__list li + li { border-top: 1px solid var(--color-border); }
.activity__list time, .activity__list span { font-size: .8rem; color: var(--color-text-muted); }
.activity__list .activity__current { color: var(--admin-accent); text-align: end; }
.activity__confirm { padding: 1rem; }
.activity__expand { width: 100%; padding: .75rem; border-top: 1px solid var(--color-border); color: var(--admin-accent); font-size: .8125rem; cursor: pointer; min-height: 44px; }
</style>
