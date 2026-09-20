import type { MaybeRefOrGetter } from 'vue'

/**
 * SEO foundation for a single page: title/description, canonical + hreflang
 * link tags (via the i18n module's locale head), and basic Open Graph tags.
 * `<html lang>`/`dir` are set once, globally, in app.vue — this composable
 * only adds what's specific to the current page. Structured data and a
 * generated sitemap are deferred to a later phase — see docs/architecture.md.
 *
 * Accepts refs/getters (not plain strings) so title/description stay correct
 * if the locale switches without the page component remounting.
 */
export function usePageSeo(
  title: MaybeRefOrGetter<string>,
  description: MaybeRefOrGetter<string>,
) {
  const { locale } = useI18n()
  const appConfig = useAppConfig()

  useSeoMeta({
    title: () => toValue(title),
    description: () => toValue(description),
    ogTitle: () => toValue(title),
    ogDescription: () => toValue(description),
    ogType: 'website',
    ogLocale: () => (locale.value === 'ar' ? 'ar_SA' : 'en_US'),
    ogSiteName: appConfig.site.name,
  })

  const localeHead = useLocaleHead()
  useHead({
    link: computed(() => localeHead.value.link),
    meta: computed(() => localeHead.value.meta),
  })
}
