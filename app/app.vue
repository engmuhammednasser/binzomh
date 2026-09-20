<script setup lang="ts">
// Sets <html lang>/dir> for the active locale, plus the base alternate
// (hreflang) links. Per-page canonical/meta/OG additions live in each
// page via usePageSeo().
const localeHead = useLocaleHead()
useHead({
  htmlAttrs: {
    lang: () => localeHead.value.htmlAttrs.lang,
    dir: () => localeHead.value.htmlAttrs.dir,
  },
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
