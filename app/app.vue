<script setup lang="ts">
// Sets <html lang>/dir> for the active locale, plus the base alternate
// (hreflang) links. Per-page canonical/meta/OG additions live in each
// page via usePageSeo().
const localeHead = useLocaleHead()
const siteName = useSiteName()
const siteUrl = useSiteUrl()
// The site's home is the origin plus app.baseURL — "/binzomh/" on a GitHub
// Pages project site — the same join the sitemap and robots routes make.
// Without it the schema named the account root, not this site.
const withBase = useAssetUrl()
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
        '@id': siteUrl(withBase('/#website')),
        'url': siteUrl(withBase('/')),
        'name': siteName.value,
        'inLanguage': ['en-US', 'ar-SA'],
      }).replaceAll('<', '\\u003c'),
    },
  ],
})
</script>

<template>
  <PreviewBanner />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
