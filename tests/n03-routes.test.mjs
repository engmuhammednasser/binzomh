import assert from 'node:assert/strict'
import test from 'node:test'
import { startServer } from './helpers/server.mjs'
import { brandProfiles, logoOnlyBrands } from '../content/brands/index.ts'
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
            assert.ok(html.includes(`href="/${locale}/contact?brand=${page.brand.slug}"`))
            assert.ok(html.includes(brands.detail.enquiryLabel.replace('{brand}', page.brand.name)))
          }
          else if (page.stem === '/brands') {
            for (const brand of brandProfiles) assert.ok(html.includes(`href="/${locale}/brands/${brand.slug}"`))
            assert.ok(html.includes(brands.rosterNotice))
            // Logo-only brands render under the roster, named, but never as
            // links: they have no profile page to link to.
            for (const brand of logoOnlyBrands) {
              assert.ok(html.includes(brand.logo.src), brand.logo.src)
              assert.ok(html.includes(escapeHtml(brand.name)), brand.name)
            }
            const linked = [...html.matchAll(new RegExp(`href="/${locale}/brands/([^"/]+)"`, 'g'))].map(match => match[1])
            assert.ok(linked.every(slug => brandProfiles.some(brand => brand.slug === slug)), linked.join())
          }
          else {
            for (const channel of network.channels) {
              assert.ok(html.includes(`id="${channel.id}"`))
              assert.ok(html.includes(escapeHtml(channel.name)))
              assert.ok(html.includes(`href="#${channel.id}"`))
            }
            assert.ok(html.includes(network.reach.note))
            assert.ok(!html.includes(network.partners.pendingBody))
            assert.ok(html.includes('class="network-partners__logos"'))
            assert.ok(html.includes(network.partners.note))
            for (const partner of network.partners.names) {
              // Three of the 28 marks are ones the company profile never
              // names (item 9), so there is no caption to look for. Their
              // logo file is what proves they rendered — and asserting it
              // for every entry covers the named ones too.
              if (partner.name) assert.ok(html.includes(escapeHtml(partner.name)), partner.name)
              assert.ok(html.includes(partner.logo.src), partner.logo.src)
            }
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

// Public-only builds omit dashboard UI and keep every CMS endpoint disabled.
test('dashboard UI and APIs stay disabled in public-only builds', { timeout: 30000 }, async () => {
  const server = await startServer()
  try {
    for (const path of ['/en/admin', '/ar/admin', '/en/admin/enquiries', '/ar/admin/pages', '/en/admin/login', '/ar/admin/contact-info', '/api/admin/session', '/api/admin/workspace', '/api/content']) {
      const response = await fetch(server.base + path)
      assert.equal(response.status, 404, path)
      await response.body?.cancel()
    }
  }
  finally {
    await server.stop()
  }
  // Editor UI must not leak into public-only bundles. Server handlers remain
  // bundled but are feature-gated before opening the database.
  const { readdirSync, readFileSync } = await import('node:fs')
  const markers = ['admin-panel', 'Your team. In focus.', 'Save a draft, review it, then publish when ready.']
  for (const root of ['.output/public', '.output/server']) {
    for (const file of readdirSync(root, { recursive: true }).filter(name => /\.(m?js|css|json|html)$/.test(name))) {
      const source = readFileSync(`${root}/${file}`, 'utf8')
      for (const marker of markers) assert.ok(!source.includes(marker), `admin code ("${marker}") leaked into ${root}/${file}`)
    }
  }
})
