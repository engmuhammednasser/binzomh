<script setup lang="ts">
const route = useRoute()
const active = useState('cms-preview', () => route.query.preview === '1')
const { locale } = useI18n()
const localePath = useLocalePath()
const assetUrl = useAssetUrl()
const shown = computed(() => active.value && !/\/admin(?:\/|$)/.test(route.path))
useHead(() => shown.value ? { meta: [{ name: 'robots', content: 'noindex, nofollow' }] } : {})
</script>

<template>
  <aside
    v-if="shown"
    class="preview-banner"
  >
    <strong>{{ locale === 'ar' ? 'معاينة المسودة المحفوظة — غير منشورة' : 'Saved draft preview — unpublished' }}</strong>
    <a :href="assetUrl(localePath('/admin') as `/${string}`)">{{ locale === 'ar' ? 'العودة للوحة التحكم' : 'Back to dashboard' }}</a>
  </aside>
</template>

<style scoped>
.preview-banner { position: sticky; top: 0; z-index: 100; display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; padding: .75rem; background: #bde4d3; color: #152b22; font-size: .875rem; }
.preview-banner a { color: inherit; text-decoration: underline; }
</style>
