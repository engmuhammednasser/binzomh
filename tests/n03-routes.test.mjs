import assert from 'node:assert/strict'
import test from 'node:test'
import { startServer } from './helpers/server.mjs'
import { brandProfiles } from '../content/brands/index.ts'
import { brandsContent as brandsEn } from '../content/en/brands.ts'
import { brandsContent as brandsAr } from '../content/ar/brands.ts'
import { networkContent as networkEn } from '../content/en/network.ts'
import { networkContent as networkAr } from '../content/ar/network.ts'

const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

function verifySeo(html, path, origin, title, description) {
  const tags = [...html.matchAll(/<(?:link|meta)\b[^>]*>/g)].map(match => match[0])
  const canonical = tags.filter(tag => tag.includes('rel="canonical"'))
  assert.equal(canonical.length, 1)
  assert.ok(canonical[0].includes(`href="${origin}${path}"`), canonical[0])
  assert.ok(tags.some(tag => tag.includes('property="og:url"') && tag.includes(`content="${origin}${path}"`)))
  const alternates = tags.filter(tag => tag.includes('hreflang='))
  const stem = path.replace(/^\/(en|ar)/, '')
  assert.ok(alternates.some(tag => tag.includes('hreflang="en"')))
  assert.ok(alternates.some(tag => tag.includes('hreflang="ar"')))
  assert.ok(alternates.some(tag => tag.includes('hreflang="x-default"')))
  for (const tag of alternates) {
    const language = tag.match(/hreflang="([^"]+)"/)[1]
    const locale = language.startsWith('ar') ? 'ar' : 'en'
    assert.ok(tag.includes(`href="${origin}/${locale}${stem}"`), tag)
  }
  assert.ok(html.includes(`<title>${escapeHtml(title)} · `), 'Localized title')
  assert.ok(tags.some(tag => tag.includes('name="description"') && tag.includes(`content="${escapeHtml(description)}"`)), 'Localized description')
}

for (const origin of ['https://binzomah.net', 'https://preview.binzomah.example']) {
  test(`brand and network routes render bilingual content and SEO at ${origin}`, { timeout: 30000 }, async () => {
    const server = await startServer(origin)
    try {
      for (const locale of ['en', 'ar']) {
        const brands = locale === 'ar' ? brandsAr : brandsEn
        const network = locale === 'ar' ? networkAr : networkEn
        const pages = [
          { stem: '/brands', title: brands.title, description: brands.description },
          { stem: '/network', title: network.title, description: network.description },
          ...brandProfiles.map(brand => ({ stem: `/brands/${brand.slug}`, title: brand.name, description: brands.detail.description.replace('{brand}', brand.name), brand })),
        ]
        for (const page of pages) {
          const path = `/${locale}${page.stem}`
          const response = await fetch(server.base + path, { redirect: 'manual', headers: { 'accept-language': locale === 'ar' ? 'en-US' : 'ar-SA' } })
          assert.equal(response.status, 200, path)
          const html = await response.text()
          const htmlTag = html.match(/<html\b[^>]*>/)[0]
          assert.ok(htmlTag.includes(`lang="${locale === 'ar' ? 'ar-SA' : 'en-US'}"`))
          assert.ok(htmlTag.includes(`dir="${locale === 'ar' ? 'rtl' : 'ltr'}"`))
          assert.equal((html.match(/<h1\b/g) || []).length, 1, path)
          assert.equal((html.match(/<[a-z]+-[a-z-]+\b/g) || []).length, 0, 'No unresolved custom components')
          verifySeo(html, path, origin, page.title, page.description)
          if (page.brand) {
            assert.equal(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]*>/g, '').trim(), page.brand.name)
            assert.ok(html.includes(brands.detail.missingIntroduction))
            assert.ok(html.includes(brands.detail.missingRelationship))
            assert.ok(html.includes(brands.detail.missingImage))
            assert.ok(!html.includes('class="brand-detail__ranges"'))
            assert.ok(!html.includes('src="/images/brands/'))
            assert.ok(html.includes(`href="/${locale}/contact"`))
            assert.ok(html.includes(brands.detail.enquiryLabel.replace('{brand}', page.brand.name)))
          }
          else if (page.stem === '/brands') {
            for (const brand of brandProfiles) assert.ok(html.includes(`href="/${locale}/brands/${brand.slug}"`))
            assert.ok(html.includes(brands.rosterNotice))
          }
          else {
            for (const channel of network.channels) {
              assert.ok(html.includes(`id="${channel.id}"`))
              assert.ok(html.includes(escapeHtml(channel.name)))
              assert.ok(html.includes(`href="#${channel.id}"`))
            }
            assert.ok(html.includes(network.reach.note))
            assert.ok(html.includes(network.partners.pendingBody))
            assert.ok(!html.includes('class="network-partners__names"'))
            assert.ok(!/70\+|3000\+|100\+|50%/.test(html))
          }
        }
        for (const slug of ['unknown-brand', 'constructor', 'Embryolisse']) {
          const response = await fetch(`${server.base}/${locale}/brands/${slug}`, { redirect: 'manual', headers: { accept: 'text/html' } })
          assert.equal(response.status, 404, `/${locale}/brands/${slug}`)
          const html = await response.text()
          const htmlTag = html.match(/<html\b[^>]*>/)[0]
          assert.ok(htmlTag.includes(`lang="${locale === 'ar' ? 'ar-SA' : 'en-US'}"`))
          assert.ok(htmlTag.includes(`dir="${locale === 'ar' ? 'rtl' : 'ltr'}"`))
          assert.ok(!html.includes('rel="canonical"'), 'Unknown brands must not become indexable profile pages')
        }
      }
      const sitemap = await (await fetch(`${server.base}/sitemap.xml`)).text()
      for (const brand of brandProfiles) {
        for (const locale of ['en', 'ar']) assert.ok(sitemap.includes(`<loc>${origin}/${locale}/brands/${brand.slug}</loc>`))
      }
      assert.doesNotMatch(sitemap, /unknown-brand|constructor/)
      assert.doesNotMatch(server.output, /\[Vue warn\]|\[unhandledRejection\]|\[request error\]/)
    }
    finally {
      await server.stop()
    }
  })
}
