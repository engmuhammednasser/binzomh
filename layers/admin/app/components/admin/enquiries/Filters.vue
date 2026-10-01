<script setup lang="ts">
import type { EnquiryFilter } from '../../../composables/useAdminEnquiries'
import { ENQUIRY_FILTERS } from '../../../composables/useAdminEnquiries'

/**
 * One segmented bar rather than separate pills, so the four views read as
 * one control. Toggle buttons rather than tabs: they filter one list, they
 * do not swap panels, so aria-pressed is the honest semantics. On narrow
 * screens the bar scrolls sideways instead of wrapping onto a second row.
 */
defineProps<{ modelValue: EnquiryFilter }>()
const emit = defineEmits<{ 'update:modelValue': [value: EnquiryFilter] }>()

const { t } = useI18n()
const { countFor } = useAdminEnquiries()
</script>

<template>
  <div
    class="segments"
    role="group"
    :aria-label="t('admin.enquiries.statusLabel')"
  >
    <button
      v-for="value in ENQUIRY_FILTERS"
      :key="value"
      type="button"
      class="segment"
      :aria-pressed="modelValue === value"
      @click="emit('update:modelValue', value)"
    >
      {{ t(`admin.enquiries.${value}`) }}
      <span class="segment__count">{{ countFor(value) }}</span>
    </button>
  </div>
</template>

<style scoped>
.segments {
  display: flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-bg-alt);
  overflow-x: auto;
  scrollbar-width: none;
}

.segments::-webkit-scrollbar {
  display: none;
}

.segment {
  flex: 1 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-block-size: 36px;
  padding: 0.25rem 0.75rem;
  border: 0;
  border-radius: 7px;
  background: none;
  color: var(--color-text-muted);
  font: inherit;
  font-size: 0.8125rem;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color var(--motion-duration-fast) var(--motion-ease),
    color var(--motion-duration-fast) var(--motion-ease);
}

.segment:hover {
  color: var(--color-text);
}

/* Weight and a raised fill as well as colour mark the current view. */
.segment[aria-pressed="true"] {
  background: var(--color-bg-raised);
  color: var(--color-text);
  font-weight: 600;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.3);
}

.segment__count {
  min-inline-size: 1.25rem;
  padding: 0 0.3rem;
  border-radius: 5px;
  background: rgb(255 255 255 / 0.06);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

@media (max-width: 540px) {
  .segment {
    padding-inline: 0.5rem;
    gap: 0.25rem;
  }
}

.segment:focus-visible {
  outline-offset: -2px;
}
</style>
