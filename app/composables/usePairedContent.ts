/**
 * Selects the Arabic or English half of a paired content pair based on the
 * active i18n locale. Keeps every page's content-selection logic identical
 * and in one place, rather than repeating the ternary per page.
 */
export function usePairedContent<T>(en: T, ar: T) {
  const { locale } = useI18n()
  return computed<T>(() => (locale.value === 'ar' ? ar : en))
}
