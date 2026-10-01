import type { SiteImagePage } from '~~/types/images'
import type { CopyRow } from '~~/types/cms'

export type AdminPageKey = SiteImagePage
export type AdminContentRow = CopyRow
export const ADMIN_PAGE_KEYS: SiteImagePage[] = ['home', 'about', 'brands', 'capabilities', 'network', 'contact']
export function useAdminPageContent() {
  const route = useRoute()
  const router = useRouter()
  const { draft, state } = useAdminWorkspace()
  const page = computed<SiteImagePage>({
    get: () => ADMIN_PAGE_KEYS.find(page => page === route.query.page) ?? 'home',
    set: (page) => { router.replace({ query: { ...route.query, page } }) },
  })
  const query = ref('')
  const rows = computed(() => draft.value?.copy[page.value] ?? [])
  const savedRows = computed(() => new Map(state.value?.draft.copy[page.value].map(row => [row.path, row])))
  const isChanged = (row: CopyRow) => {
    const saved = savedRows.value.get(row.path)
    return row.en !== saved?.en || row.ar !== saved?.ar
  }
  const pageChanged = (key: SiteImagePage) => JSON.stringify(draft.value?.copy[key]) !== JSON.stringify(state.value?.draft.copy[key])
  const setValue = (row: CopyRow, lang: 'en' | 'ar', value: string) => {
    row[lang] = value
  }
  return { page, query, rows, setValue, isChanged, pageChanged }
}
