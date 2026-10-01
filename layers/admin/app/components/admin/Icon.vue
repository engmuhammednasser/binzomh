<script setup lang="ts">
const paths = {
  overview: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  inbox: 'M4 4h16l2 11v5H2v-5L4 4z M2 15h6l2 3h4l2-3h6 M8 8h8 M8 11h5',
  brands: 'M12 3l9 5v9l-9 5-9-5V8l9-5z M3 8l9 5 9-5 M12 13v9 M8 5l9 5',
  team: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  pages: 'M14 2H5v20h14V7l-5-5z M14 2v5h5 M8 12h8 M8 16h8',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M3 12h18 M12 3c5 5 5 13 0 18-5-5-5-13 0-18',
  exit: 'M9 3H3v18h6 M9 12h12 M17 8l4 4-4 4',
  check: 'M5 12l4 4L19 6',
  image: 'M3 3h18v18H3z M3 17l6-6 4 4 3-3 5 5 M16 7h.01',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1',
  contact: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
} as const

defineProps<{ name: keyof typeof paths }>()
</script>

<template>
  <svg
    class="admin-icon"
    :class="{ 'admin-icon--directional': name === 'arrow' || name === 'exit' }"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="paths[name]" />
  </svg>
</template>

<style scoped>
.admin-icon {
  flex: 0 0 auto;
}
.admin-icon--directional:dir(rtl) {
  transform: scaleX(-1);
}
</style>
