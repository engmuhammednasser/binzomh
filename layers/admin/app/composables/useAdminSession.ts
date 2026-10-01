import type { AdminSession } from '~~/types/cms'

export function useAdminSession() {
  const session = useState<AdminSession | null>('cms-session', () => null)
  const base = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
  const request = useRequestFetch()
  const localePath = useLocalePath()
  const assetUrl = useAssetUrl()
  async function check() {
    session.value = await request<AdminSession>(`${base}/api/admin/session`)
  }
  async function login(email: string, password: string) {
    session.value = await $fetch<AdminSession>(`${base}/api/admin/login`, { method: 'POST', body: { email, password }, timeout: 15000, retry: 0 })
  }
  async function logout() {
    await $fetch(`${base}/api/admin/logout`, { method: 'POST', headers: { 'x-csrf-token': session.value?.csrf || '' } })
    clearNuxtState(key => key.startsWith('cms-'))
    // A full navigation also discards private reactive editor state.
    await navigateTo(assetUrl(localePath('/admin/login') as `/${string}`), { external: true })
  }
  return { session, base, check, login, logout }
}
