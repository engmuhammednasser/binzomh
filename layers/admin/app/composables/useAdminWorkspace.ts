import type { Workspace, WorkspaceResponse } from '~~/types/cms'

export function useAdminWorkspace() {
  const state = useState<WorkspaceResponse | null>('cms-workspace', () => null)
  const draft = useState<Workspace | null>('cms-draft', () => null)
  const saving = useState('cms-busy', () => false)
  const uploads = useState('cms-uploads', () => 0)
  const busy = computed(() => saving.value || uploads.value > 0)
  const error = useState('cms-error', () => '')
  const notice = useState('cms-notice', () => '')
  const { session, base } = useAdminSession()
  const request = useRequestFetch()
  const { t } = useNuxtApp().$i18n
  const dirty = computed(() => JSON.stringify(draft.value) !== JSON.stringify(state.value?.draft ?? null))
  const unpublished = computed(() => state.value && state.value.revision !== state.value.publishedRevision)
  function accept(value: WorkspaceResponse) {
    state.value = value
    draft.value = JSON.parse(JSON.stringify(value.draft))
  }
  async function load() {
    if (!state.value) accept(await request<WorkspaceResponse>(`${base}/api/admin/workspace`))
  }
  async function action(kind: 'save' | 'publish' | 'restore', target?: number) {
    if (busy.value || !state.value) return
    saving.value = true
    error.value = ''
    notice.value = ''
    const submitted = JSON.stringify(draft.value)
    try {
      const result = await $fetch<WorkspaceResponse>(`${base}/api/admin/${kind === 'save' ? 'workspace' : kind}`, {
        method: kind === 'save' ? 'PUT' : 'POST',
        headers: { 'x-csrf-token': session.value?.csrf || '' },
        body: { revision: state.value.revision, ...(kind === 'save' ? { draft: JSON.parse(submitted) } : {}), ...(target !== undefined ? { target } : {}) },
      })
      // Typing during a save must not be overwritten by its delayed response.
      if (submitted === JSON.stringify(draft.value) || kind === 'restore') accept(result)
      else state.value = result
      notice.value = t(`admin.live.${kind}Done`)
    }
    catch (cause) {
      const failure = cause as { statusCode?: number, data?: { statusMessage?: string } }
      error.value = failure.statusCode === 409
        ? t('admin.live.conflict')
        : failure.statusCode === 401
          ? t('admin.live.expired')
          : failure.data?.statusMessage || t('admin.live.failed')
    }
    finally { saving.value = false }
  }
  async function reload() {
    try {
      accept(await request<WorkspaceResponse>(`${base}/api/admin/workspace`))
      error.value = ''
      notice.value = ''
    }
    catch {
      error.value = t('admin.live.failed')
    }
  }
  return { state, draft, busy, uploads, error, notice, dirty, unpublished, load, action, reload }
}
