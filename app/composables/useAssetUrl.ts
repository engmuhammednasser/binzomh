import { assetUrl } from '~~/shared/utils/asset-url'

/**
 * See shared/utils/asset-url.ts for why this exists: any *dynamic* src/href
 * for a public asset (anything not a static, literal template attribute)
 * needs to be routed through this so it still resolves under a non-root
 * app.baseURL (e.g. a GitHub Pages project site).
 */
export function useAssetUrl() {
  const { app } = useRuntimeConfig()
  return (path: string) => assetUrl(app.baseURL, path)
}
