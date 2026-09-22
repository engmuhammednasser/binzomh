/**
 * Resolves a root-relative public asset path (e.g. "/logos/foo.png") against
 * the app's configured base path (app.baseURL / NUXT_APP_BASE_URL).
 *
 * Nuxt's build-time asset-URL transform only rewrites *static* template
 * attributes (a literal src="/foo.png") to carry the base path — a
 * *dynamic* :src bound to a computed or template-literal string bypasses
 * that transform entirely and is emitted as a plain, unprefixed string.
 * That's invisible while app.baseURL is "/" (the default, and what
 * production at the real domain uses), but breaks any deployment served
 * from a sub-path — e.g. a GitHub Pages project site at "/reponame/",
 * where an unprefixed "/logos/foo.png" 404s instead of resolving under
 * that sub-path. Any component with a dynamic src/href for a public
 * asset should route it through this helper (see useAssetUrl in
 * app/composables) rather than interpolating the path directly.
 */
export function assetUrl(baseURL: string, path: string) {
  if (!path.startsWith('/') || path.startsWith('//')) {
    throw new Error('assetUrl() requires a root-relative path')
  }
  const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
  return `${base}${path}`
}
