import type { MaybeRefOrGetter } from 'vue'

/**
 * SEO foundation for a single page: title/description, canonical + hreflang
 * link tags (via the i18n module's locale head), and basic Open Graph tags.
 * `<html lang>`/`dir` are set once, globally, in app.vue — this composable
 * only adds what's specific to the current page. All absolute URLs follow
 * runtimeConfig.public.siteUrl. i18n owns the localized paths; this
 * composable applies the runtime origin to its canonical/hreflang/OG tags.
 *
 * Accepts refs/getters (not plain strings) so title/description stay correct
 * if the locale switches without the page component remounting.
 */
export function usePageSeo(
  title: MaybeRefOrGetter<string>,
  description: MaybeRefOrGetter<string>,
) {
  const { locale } = useI18n()
  const siteName = useSiteName()
  const siteUrl = useSiteUrl()
  const withSiteOrigin = (url: string) => {
    const { pathname, search, hash } = new URL(url)
    return siteUrl(`${pathname}${search}${hash}`)
  }

  useSeoMeta({
    title: () => toValue(title),
    description: () => toValue(description),
    ogTitle: () => toValue(title),
    ogDescription: () => toValue(description),
    ogType: 'website',
    ogLocale: () => (locale.value === 'ar' ? 'ar_SA' : 'en_US'),
    ogSiteName: () => siteName.value,
  })

  const localeHead = useLocaleHead()
  useHead({
    link: computed(() => localeHead.value.link.map(link => ({
      ...link,
      href: withSiteOrigin(link.href),
    }))),
    meta: computed(() => localeHead.value.meta.map(meta => meta.property === 'og:url'
      ? { ...meta, content: withSiteOrigin(String(meta.content)) }
      : meta)),
  })
}
