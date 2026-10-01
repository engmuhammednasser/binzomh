<script setup lang="ts">
const props = defineProps<{ paused: boolean }>()
defineEmits<{ toggle: [] }>()
const { t } = useI18n()
const label = computed(() => t(props.paused ? 'common.resumeMotion' : 'common.pauseMotion'))
</script>

<template>
  <button
    type="button"
    class="motion-control"
    :aria-label="label"
    :title="label"
    @click="$emit('toggle')"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
    >
      <path
        v-if="paused"
        d="M8.5 5.8v12.4L18 12z"
      />
      <g v-else>
        <rect
          x="8"
          y="6"
          width="2.5"
          height="12"
          rx="1"
        />
        <rect
          x="13.5"
          y="6"
          width="2.5"
          height="12"
          rx="1"
        />
      </g>
    </svg>
  </button>
</template>

<style scoped>
.motion-control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 44px;
  block-size: 44px;
  margin-block-start: var(--space-3);
  padding: 0;
  border: 1px solid currentColor;
  border-radius: 50%;
  color: inherit;
  background: transparent;
  cursor: pointer;
}
</style>
