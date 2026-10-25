/**
 * Selects the Arabic or English half of a paired content pair based on the
 * active i18n locale. Keeps every page's content-selection logic identical
 * and in one place, rather than repeating the ternary per page.
 */
import type { Workspace } from '~~/types/cms'
import type { SiteImagePage } from '~~/types/images'
import { applyCopy } from '~~/shared/utils/cms-copy'
import { applyLogos } from '~~/shared/utils/cms-logos'

export function usePairedContent<T>(en: T, ar: T, page?: SiteImagePage) {
  const { locale } = useI18n()
  const managed = useState<Workspace | null>('managed-content', () => null)
  return computed<T>(() => {
    const language = locale.value === 'ar' ? 'ar' : 'en'
    const source = language === 'ar' ? ar : en
    return page && managed.value ? applyLogos(applyCopy(source, managed.value.copy[page], language), managed.value.logos) : source
  })
}
