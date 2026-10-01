/**
 * The dashboard's sections, in rail order. One list feeds both the side
 * rail and the top bar's breadcrumb, so the two can never name the
 * current section differently.
 */
export function useAdminNav() {
  const { t } = useI18n()
  const localePath = useLocalePath()
  const route = useRoute()
  const { newCount } = useAdminEnquiries()

  const items = computed(() => [
    { to: '/admin', label: t('admin.nav.overview'), icon: 'overview' as const },
    { to: '/admin/enquiries', label: t('admin.nav.enquiries'), icon: 'inbox' as const, badge: newCount.value || undefined },
    { to: '/admin/brands', label: t('admin.nav.brands'), icon: 'brands' as const },
    { to: '/admin/team', label: t('admin.nav.team'), icon: 'team' as const },
    { to: '/admin/pages', label: t('admin.nav.pages'), icon: 'pages' as const },
    { to: '/admin/contact-info', label: t('admin.nav.contactInfo'), icon: 'contact' as const },
  ])

  const current = computed(() =>
    items.value.find(item => localePath(item.to) === route.path.replace(/\/$/, ''))?.label ?? t('admin.nav.overview'),
  )

  return { items, current }
}
