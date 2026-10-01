<script setup lang="ts">
import { ENQUIRY_FILTERS, type EnquiryFilter } from '../../composables/useAdminEnquiries'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { t } = useI18n()
const { enquiries, error, refresh } = useAdminEnquiries()
const route = useRoute()
const router = useRouter()
const detail = useTemplateRef<{ focus: () => void }>('detail')

useHead({ title: () => t('admin.enquiries.heading') })

// Query state makes overview shortcuts, reloads and browser history agree.
// Unknown or repeated query values fall back to the unfiltered inbox.
const filter = computed<EnquiryFilter>(() => ENQUIRY_FILTERS.find(value => value === route.query.status) ?? 'all')

// Search is a quick narrowing of what is on screen, so it stays local
// rather than going into the URL like the filter does.
const search = ref('')

const visible = computed(() => {
  const q = search.value.trim().toLowerCase()
  return enquiries.value.filter(item =>
    (filter.value === 'all' || item.status === filter.value)
    && (!q || [item.name, item.email, item.company ?? '', item.message].some(text => text.toLowerCase().includes(q))),
  )
})

// Looked up in the whole inbox, not just the visible rows: changing an
// open enquiry's status can move it out of the current filter, and the
// reader should not have what they are working on vanish mid-action.
const selected = computed(() => enquiries.value.find(item => item.id === route.query.id) ?? null)

function changeFilter(value: EnquiryFilter) {
  return router.push({ query: { ...route.query, status: value === 'all' ? undefined : value, id: undefined } })
}

async function selectEnquiry(id: string) {
  await router.push({ query: { ...route.query, id } })
  await nextTick()
  detail.value?.focus()
}

// Phone layout only: back from the open enquiry to the list, returning
// focus to the row it came from — or, when a status change has moved that
// row out of the current filter, to the list's first row or the search.
async function backToList() {
  const id = selected.value?.id
  await router.push({ query: { ...route.query, id: undefined } })
  await nextTick()
  const target = (id && document.getElementById(`enquiry-row-${id}`))
    || document.querySelector<HTMLElement>('.inbox__scroll button')
    || document.querySelector<HTMLElement>('.search__input')
  target?.focus()
}
</script>

<template>
  <div>
    <AdminPageHeader
      :heading="t('admin.enquiries.heading')"
      :intro="t('admin.enquiries.intro')"
    >
      <template #actions>
        <span
          class="sample-tag"
          :title="t('admin.enquiries.sampleNote')"
        >{{ t('admin.enquiries.sampleTag') }}</span>
      </template>
    </AdminPageHeader>

    <AdminEnquiriesCreate />
    <p
      v-if="error"
      role="alert"
    >
      {{ error }} <button
        class="admin-btn"
        @click="refresh"
      >
        {{ t('admin.live.reload') }}
      </button>
    </p>
    <div
      class="admin-panel inbox"
      :class="{ 'has-selection': selected }"
    >
      <div class="inbox__pane inbox__pane--list">
        <div class="inbox__toolbar">
          <label class="search">
            <AdminIcon
              name="search"
              class="search__icon"
            />
            <span class="visually-hidden">{{ t('admin.enquiries.search') }}</span>
            <input
              v-model="search"
              type="search"
              class="search__input"
              :placeholder="t('admin.enquiries.search')"
            >
          </label>
          <AdminEnquiriesFilters
            :model-value="filter"
            @update:model-value="changeFilter"
          />
        </div>
        <div class="inbox__scroll">
          <AdminEnquiriesList
            :items="visible"
            :selected-id="selected?.id"
            :searching="!!search.trim()"
            @select="selectEnquiry"
          />
        </div>
      </div>

      <div class="inbox__pane inbox__pane--detail">
        <AdminEnquiriesDetail
          ref="detail"
          :enquiry="selected"
          @back="backToList"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sample-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  cursor: help;
}

.sample-tag::before {
  content: '';
  inline-size: 6px;
  block-size: 6px;
  border-radius: 50%;
  background: var(--admin-warning);
}

/*
  One panel, two panes, like a mail client: the list and the open
  enquiry sit side by side at a fixed height and scroll independently, so
  choosing a message never moves the list the reader was scanning.
*/
.inbox {
  display: grid;
  grid-template-columns: minmax(20rem, 26rem) minmax(0, 1fr);
  block-size: clamp(32rem, calc(100svh - 18rem), 56rem);
  overflow: hidden;
}

.inbox__pane {
  display: flex;
  flex-direction: column;
  min-block-size: 0;
}

.inbox__pane--list {
  border-inline-end: 1px solid var(--color-border);
}

.inbox__pane--detail {
  overflow-y: auto;
}

.inbox__toolbar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border-block-end: 1px solid var(--color-border);
}

.inbox__scroll {
  flex: 1;
  overflow-y: auto;
}

.search {
  position: relative;
  display: block;
}

.search__icon {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 0.75rem;
  inline-size: 18px;
  color: var(--color-text-muted);
  transform: translateY(-50%);
  pointer-events: none;
}

.search__input {
  inline-size: 100%;
  min-block-size: 40px;
  padding: 0.5rem 0.75rem;
  padding-inline-start: 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-bg-alt);
  color: var(--color-text);
  font: inherit;
  font-size: 0.875rem;
}

.search__input::placeholder {
  color: var(--color-text-muted);
}

.search__input:focus-visible {
  border-color: var(--color-border-strong);
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 0;
}

/*
  Phones: one pane at a time. The list until a row is chosen, then the
  enquiry alone with a way back — the side-by-side layout left the open
  message a full list's height below the tap that opened it.
*/
@media (max-width: 900px) {
  .inbox {
    grid-template-columns: minmax(0, 1fr);
    block-size: auto;
    overflow: visible;
  }

  .inbox__pane--list {
    border-inline-end: 0;
  }

  .inbox__scroll,
  .inbox__pane--detail {
    overflow: visible;
  }

  .inbox:not(.has-selection) .inbox__pane--detail,
  .inbox.has-selection .inbox__pane--list {
    display: none;
  }
}
</style>
