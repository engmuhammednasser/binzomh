import { absoluteSiteUrl } from '../../shared/utils/site-url'
import { assetUrl } from '../../shared/utils/asset-url'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  // See sitemap.xml.ts — the sitemap URL needs app.baseURL applied
  // explicitly for the same reason.
  const sitemapUrl = absoluteSiteUrl(config.public.siteUrl, assetUrl(config.app.baseURL, '/sitemap.xml'))
  return `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`
})
