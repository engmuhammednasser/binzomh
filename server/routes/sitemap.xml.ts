import { absoluteSiteUrl } from '../../shared/utils/site-url'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const paths = ['', '/about', '/brands', '/capabilities', '/network', '/contact']
  const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  const url = (path: string) => escapeXml(absoluteSiteUrl(config.public.siteUrl, path))
  const entries = ['en', 'ar'].flatMap(locale => paths.map((path) => {
    const alternates = ['en', 'ar'].map(code => `<xhtml:link rel="alternate" hreflang="${code}" href="${url(`/${code}${path}`)}"/>`).join('')
    return `<url><loc>${url(`/${locale}${path}`)}</loc>${alternates}<xhtml:link rel="alternate" hreflang="x-default" href="${url(`/en${path}`)}"/></url>`
  }))
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`
})
