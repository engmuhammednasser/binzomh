export function useSiteName() {
  const { locale } = useI18n()
  const { site } = useAppConfig()
  return computed(() => locale.value === 'ar' ? site.nameAr : site.name)
}
