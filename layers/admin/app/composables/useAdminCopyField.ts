import type { SiteImagePage } from '~~/types/images'

export function useAdminCopyField(page: SiteImagePage, path: string | (() => string), language: 'en' | 'ar') {
  const { draft } = useAdminWorkspace()
  const row = () => draft.value?.copy[page].find(row => row.path === (typeof path === 'function' ? path() : path))
  return computed({ get: () => row()?.[language] ?? '', set: (value: string) => {
    const found = row()
    if (found) found[language] = value
  } })
}
