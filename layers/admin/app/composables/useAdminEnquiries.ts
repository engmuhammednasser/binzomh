export type EnquiryStatus = 'new' | 'replied' | 'archived'

/** The inbox views, in filter-bar order: everything, then one per status. */
export type EnquiryFilter = 'all' | EnquiryStatus
export const ENQUIRY_FILTERS: readonly EnquiryFilter[] = ['all', 'new', 'replied', 'archived']

export interface AdminEnquiry {
  id: string
  name: string
  email: string
  company?: string
  message: string
  /** ISO 8601, UTC. */
  receivedAt: string
  status: EnquiryStatus
}

/**
 * Pinned to Riyadh time rather than the runtime's own zone: the server and
 * the browser can sit in different zones, and formatting in each one's
 * local time would render two different strings and break hydration.
 */
export function formatReceived(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA-u-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Riyadh',
  }).format(new Date(iso))
}

export function useAdminEnquiries() {
  const enquiries = useState<AdminEnquiry[]>('cms-enquiries', () => [])
  const busy = useState('cms-inbox-busy', () => false)
  const error = useState('cms-inbox-error', () => '')
  const { session, base } = useAdminSession()
  const request = useRequestFetch()
  const { t } = useI18n()
  async function refresh() {
    try {
      enquiries.value = await request<AdminEnquiry[]>(`${base}/api/admin/enquiries`)
      error.value = ''
    }
    catch {
      error.value = t('admin.live.failed')
    }
  }
  async function setStatus(id: string, status: EnquiryStatus) {
    const item = enquiries.value.find(entry => entry.id === id)
    if (!item || busy.value) return
    busy.value = true
    error.value = ''
    try {
      const result = await $fetch<AdminEnquiry>(`${base}/api/admin/enquiries`, { method: 'PATCH', headers: { 'x-csrf-token': session.value?.csrf || '' }, body: { id, status, previous: item.status } })
      Object.assign(item, result)
    }
    catch {
      error.value = t('admin.live.inboxFailed')
    }
    finally { busy.value = false }
  }
  async function add(value: {
    name: string
    email: string
    company: string
    message: string
  }) {
    if (busy.value) return false
    busy.value = true
    error.value = ''
    try {
      const result = await $fetch<AdminEnquiry>(`${base}/api/admin/enquiries`, { method: 'POST', headers: { 'x-csrf-token': session.value?.csrf || '' }, body: value })
      enquiries.value.unshift(result)
      return true
    }
    catch {
      error.value = t('admin.live.failed')
      return false
    }
    finally { busy.value = false }
  }
  const newCount = computed(() => enquiries.value.filter(item => item.status === 'new').length)
  const countFor = (filter: EnquiryFilter) => filter === 'all' ? enquiries.value.length : enquiries.value.filter(item => item.status === filter).length
  return { enquiries, setStatus, newCount, countFor, refresh, add, busy, error }
}
