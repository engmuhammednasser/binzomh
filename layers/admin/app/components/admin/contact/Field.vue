<script setup lang="ts">
import type { ContactFieldError } from '../../../../utils/contact-validation'

/**
 * A labelled input with its hint and error wired up for assistive tech:
 * the slot receives the ids to put on the control, so the label, the
 * aria-describedby hint/error and aria-invalid stay in step with what is
 * shown. The error only appears once the field has been left or changed,
 * not while the form is first being read.
 */
const props = defineProps<{
  id: string
  label: string
  hint?: string
  error?: ContactFieldError
  errorParams?: Record<string, string>
  changed?: boolean
}>()

const { t } = useI18n()
const touched = ref(false)
const showError = computed(() => Boolean(props.error && (touched.value || props.changed)))
const describedBy = computed(() =>
  [props.hint && `${props.id}-hint`, showError.value && `${props.id}-error`].filter(Boolean).join(' ') || undefined,
)
</script>

<template>
  <div
    class="field"
    :class="{ 'has-error': showError }"
    @focusout="touched = true"
  >
    <div class="field__label-row">
      <label
        :for="id"
        class="field__label"
      >{{ label }}</label>
      <span
        v-if="changed"
        class="field__changed"
        :title="t('admin.contactInfo.changed')"
      ><span class="visually-hidden">{{ t('admin.contactInfo.changed') }}</span></span>
    </div>
    <slot
      :id="id"
      :described-by="describedBy"
      :invalid="showError"
    />
    <p
      v-if="hint"
      :id="`${id}-hint`"
      class="field__hint"
    >
      {{ hint }}
    </p>
    <p
      v-if="showError"
      :id="`${id}-error`"
      class="field__error"
    >
      {{ t(`admin.contactInfo.errors.${error}`, errorParams ?? {}) }}
    </p>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-inline-size: 0;
}

.field__label-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.field__label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.field__changed {
  inline-size: 6px;
  block-size: 6px;
  border-radius: 50%;
  background: var(--admin-warning);
  font-size: 0;
}

.field__hint,
.field__error {
  max-inline-size: none;
  margin: 0;
  font-size: 0.75rem;
}

.field__hint {
  color: var(--color-text-muted);
}

.field__error {
  color: #f0b5ac;
}

.field :slotted(.admin-field__input) {
  background: var(--color-bg-alt);
  border-color: var(--color-border);
}

.field.has-error :slotted(.admin-field__input) {
  border-color: #e0897c;
}
</style>
