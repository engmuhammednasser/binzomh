<script setup lang="ts">
import type { ContentStatus } from '~~/types/content'
import type { EnquiryStatus } from '../../composables/useAdminEnquiries'

/**
 * One pill for both vocabularies the admin shows: a content field's
 * approval state and an enquiry's inbox state. Each state carries a glyph
 * as well as a tone, so none is told apart by colour alone.
 */
const props = defineProps<{ status: ContentStatus | EnquiryStatus }>()

const { t } = useI18n()

const meta = computed(() => {
  switch (props.status) {
    case 'approved': return { tone: 'positive', glyph: '✓', label: t('admin.status.approved') }
    case 'draft': return { tone: 'neutral', glyph: '•', label: t('admin.status.draft') }
    case 'blocked': return { tone: 'negative', glyph: '✕', label: t('admin.status.blocked') }
    case 'missing': return { tone: 'quiet', glyph: '–', label: t('admin.status.missing') }
    case 'new': return { tone: 'strong', glyph: '●', label: t('admin.enquiries.new') }
    case 'replied': return { tone: 'positive', glyph: '✓', label: t('admin.enquiries.replied') }
    default: return { tone: 'quiet', glyph: '–', label: t('admin.enquiries.archived') }
  }
})
</script>

<template>
  <span
    class="admin-status"
    :class="`admin-status--${meta.tone}`"
  >
    <span aria-hidden="true">{{ meta.glyph }}</span>
    {{ meta.label }}
  </span>
</template>

<style scoped>
.admin-status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 0.125rem var(--space-2);
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: var(--font-size-label);
  font-weight: 600;
  white-space: nowrap;
}

.admin-status--positive {
  background: var(--admin-success-bg);
  color: var(--admin-success);
}

.admin-status--negative {
  background: var(--admin-error-bg);
  color: var(--admin-error-text);
}

.admin-status--neutral {
  background: var(--color-bg-raised);
  color: var(--color-text-muted);
}

.admin-status--quiet {
  border-color: var(--color-border);
  color: var(--color-text-muted);
}

.admin-status--strong {
  background: var(--admin-accent);
  color: var(--admin-accent-ink);
}
</style>
