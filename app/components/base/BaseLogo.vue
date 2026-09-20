<script setup lang="ts">
interface Props {
  variant?: 'dark' | 'light'
  /** CSS length for the rendered block-size. Defaults to the original 2rem. */
  size?: string
}

const props = withDefaults(defineProps<Props>(), { variant: 'dark', size: '2rem' })
const siteName = useSiteName()

// The two source files are not the same aspect ratio (1252x329 vs.
// 1254x323) — each variant's real dimensions are used rather than sharing
// one hard-coded ratio. See docs/design-tokens.md.
const sources = {
  dark: { src: '/logos/binzomah-logo-dark.png', width: 1252, height: 329 },
  light: { src: '/logos/binzomah-logo-light.png', width: 1254, height: 323 },
} as const

const source = computed(() => sources[props.variant])
</script>

<template>
  <img
    :src="source.src"
    :width="source.width"
    :height="source.height"
    :alt="siteName"
    class="base-logo"
    :class="`base-logo--${props.variant}`"
    :style="{ blockSize: size }"
    decoding="async"
  >
</template>

<style scoped>
.base-logo {
  block-size: 2rem;
  inline-size: auto;
}

/* binzomah-logo-light.png has zero top padding, unlike the dark variant's
   ~3% margin — add a matching top offset so both lockups sit at the same
   visual baseline. See the source asset register's "asset issues found". */
.base-logo--light {
  margin-block-start: 0.06em;
}
</style>
