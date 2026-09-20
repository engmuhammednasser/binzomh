/**
 * The primary navigation list, shared by AppHeader (top nav + mobile
 * drawer) and AppFooter (footer nav) so the two never drift out of sync.
 */
export function useNavItems() {
  const { t } = useI18n()

  return computed(() => [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.about'), to: '/about' },
    { label: t('nav.brands'), to: '/brands' },
    { label: t('nav.capabilities'), to: '/capabilities' },
    { label: t('nav.network'), to: '/network' },
    { label: t('nav.contact'), to: '/contact' },
  ])
}
