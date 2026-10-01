import type { Workspace } from '~~/types/cms'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig()
  if (!config.public.adminEnabled || /\/admin(?:\/|$)/.test(to.path)) return
  const content = useState<Workspace | null>('managed-content', () => null)
  const preview = useState('cms-preview', () => false)
  const requestedPreview = to.query.preview === '1'
  // Initial SSR supplies the hydration payload. Refresh when switching modes or
  // returning from an editor/sign-in screen, including client-side navigation.
  if (!content.value || preview.value !== requestedPreview || /\/admin(?:\/|$)/.test(from.path)) {
    const request = useRequestFetch()
    const base = config.app.baseURL.replace(/\/$/, '')
    content.value = await request<Workspace>(`${base}/api/${requestedPreview ? 'admin/preview' : 'content'}`)
  }
  preview.value = requestedPreview
})
