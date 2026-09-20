<script setup lang="ts">
// Sets <html lang>/dir> for the active locale, plus the base alternate
// (hreflang) links. Per-page canonical/meta/OG additions live in each
// page via usePageSeo().
const localeHead = useLocaleHead()
const siteName = useSiteName()
const siteUrl = useSiteUrl()
useHead({
  titleTemplate: title => title && title !== siteName.value ? `${title} · ${siteName.value}` : siteName.value,
  htmlAttrs: {
    lang: () => localeHead.value.htmlAttrs.lang,
    dir: () => localeHead.value.htmlAttrs.dir,
  },
  script: [
    {
      key: 'website-schema',
      type: 'application/ld+json',
      textContent: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': siteUrl('/#website'),
        'url': siteUrl(),
        'name': siteName.value,
        'inLanguage': ['en-US', 'ar-SA'],
      }).replaceAll('<', '\\u003c'),
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
