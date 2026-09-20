<script setup lang="ts">
withDefaults(defineProps<{ content?: boolean }>(), { content: false })
</script>

<template>
  <div
    class="container"
    :class="{ 'container--content': content }"
  >
    <slot />
  </div>
</template>
