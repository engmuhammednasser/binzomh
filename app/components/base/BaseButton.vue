<script setup lang="ts">
interface Props {
  to?: string
  variant?: 'primary' | 'secondary' | 'text'
  external?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  variant: 'primary',
  external: false,
})

const localePath = useLocalePath()
const resolvedTo = computed(() => (props.to && !props.external ? localePath(props.to) : undefined))
const variantClass = computed(() => `base-button base-button--${props.variant}`)
</script>

<template>
  <NuxtLink
    v-if="to && !external"
    :to="resolvedTo"
    :class="variantClass"
  >
    <slot name="icon-start" />
    <span class="base-button__label"><slot /></span>
    <slot name="icon-end" />
  </NuxtLink>
  <a
    v-else-if="to && external"
    :href="to"
    rel="noopener noreferrer"
    target="_blank"
    :class="variantClass"
  >
    <slot name="icon-start" />
    <span class="base-button__label"><slot /></span>
    <slot name="icon-end" />
  </a>
  <button
    v-else
    type="button"
    :class="variantClass"
  >
    <slot name="icon-start" />
    <span class="base-button__label"><slot /></span>
    <slot name="icon-end" />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-block-size: 44px;
  padding-inline: var(--space-5);
  padding-block: var(--space-3);
  border-radius: var(--radius-sm);
  font-weight: 600;
  text-decoration: none;
  border: 1px solid transparent;
  transition:
    background-color var(--motion-duration-fast) var(--motion-ease),
    color var(--motion-duration-fast) var(--motion-ease),
    border-color var(--motion-duration-fast) var(--motion-ease);
}

.base-button--primary {
  background: var(--color-bg-inverse);
  color: var(--color-text-on-dark);
}

.base-button--primary:hover {
  background: var(--palette-ink-600);
}

.base-button--secondary {
  background: transparent;
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.base-button--secondary:hover {
  border-color: var(--color-text);
}

.base-button--text {
  background: transparent;
  padding-inline: 0;
  min-block-size: auto;
  color: var(--color-text);
  text-decoration: underline;
}
</style>
