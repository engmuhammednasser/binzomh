/** All first-party absolute URLs must use the configured deployment origin. */
export function absoluteSiteUrl(origin: string, path = '/') {
  const base = new URL(origin)
  if (!['http:', 'https:'].includes(base.protocol)
    || base.username || base.password || base.search || base.hash
    || base.pathname !== '/') {
    throw new Error('NUXT_PUBLIC_SITE_URL must be an HTTP(S) origin without a path, credentials, query, or fragment')
  }
  if (!path.startsWith('/') || path.startsWith('//')) {
    throw new Error('Site URLs require a root-relative path')
  }
  const url = new URL(path, base.origin)
  if (url.origin !== base.origin) throw new Error('Site URL must stay on the configured origin')
  return url.href
}
