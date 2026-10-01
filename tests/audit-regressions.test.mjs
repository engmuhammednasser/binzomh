import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import test from 'node:test'
import { preferredLocale } from '../public/locale-redirect.js'
import { staticLocaleEntry } from '../build/static-entry.ts'
import { contentSecurityPolicy, withStaticCsp } from '../server/utils/security-policy.ts'
import { getSiteImageSlot } from '../content/images.ts'
import { homeContent as homeEn } from '../content/en/home.ts'
import { homeContent as homeAr } from '../content/ar/home.ts'
import { capabilitiesContent as capEn } from '../content/en/capabilities.ts'
import { capabilitiesContent as capAr } from '../content/ar/capabilities.ts'
import { imageVariantPath } from '../shared/utils/site-image.ts'
import { startServer } from './helpers/server.mjs'

test('static entry chooses a safe locale: cookie, browser preferences, then English', () => {
  assert.equal(preferredLocale('other=x; binzomh_locale=ar', ['en-US']), 'ar')
  assert.equal(preferredLocale('binzomh_locale=en', ['ar-SA']), 'en')
  for (const cookie of ['', 'binzomh_locale=%E0%A4%A', 'binzomh_locale=https://evil.example']) {
    assert.equal(preferredLocale(cookie, ['fr-FR', 'ar-EG', 'en-US']), 'ar')
  }
  assert.equal(preferredLocale('', ['fr-FR']), 'en')
  const html = staticLocaleEntry('/preview/')
  assert.ok(html.includes('href="/preview/ar"'))
  assert.ok(html.includes('src="/preview/locale-redirect.js"'))
  assert.ok(!/http-equiv="refresh"/.test(html))
})

test('capability identities survive reorder, locale switches and additional image-free items', () => {
  for (const [en, ar] of [[homeEn.capabilities.items, homeAr.capabilities.items], [capEn.sections, capAr.sections]]) {
    assert.equal(new Set(en.map(item => item.id)).size, en.length)
    assert.deepEqual(en.map(item => [item.id, item.imageSlotId]), ar.map(item => [item.id, item.imageSlotId]))
    const reordered = [...en].reverse().concat({ id: 'future-capability' })
    for (const item of reordered) {
      const slot = getSiteImageSlot(item.imageSlotId)
      if (item.id === 'future-capability') assert.equal(slot, undefined)
      else assert.equal(slot.id, en.find(original => original.id === item.id).imageSlotId)
    }
  }
  assert.equal(getSiteImageSlot('constructor'), undefined)
  assert.equal(getSiteImageSlot('unknown-slot'), undefined)
})

test('About responsive candidates exist and never upscale the original', () => {
  for (const id of ['about-hero', 'about-overview', 'about-location']) {
    const image = getSiteImageSlot(id).image
    assert.deepEqual(image.variants.widths, [480, 960])
    for (const width of image.variants.widths) {
      assert.ok(width < image.width)
      assert.ok(existsSync(`public${imageVariantPath(image, width, 'webp')}`))
    }
  }
})

test('CSP hashes rendered scripts and grants only the configured contact origin', () => {
  const js = 'window.__NUXT__={};'
  const html = `<html><head></head><body><script>${js}</script></body></html>`
  const hash = createHash('sha256').update(js).digest('base64')
  const policy = contentSecurityPolicy(html, 'https://forms.example/submit?secret=not-a-real-secret')
  assert.ok(policy.includes(`'sha256-${hash}'`))
  assert.ok(policy.includes('connect-src \'self\' https://forms.example'))
  assert.ok(!policy.includes('secret'))
  assert.ok(!policy.split(';').find(part => part.includes('script-src')).includes('unsafe-inline'))
  assert.ok(policy.includes('frame-ancestors \'none\''))
  const staticHtml = withStaticCsp(html)
  assert.ok(staticHtml.indexOf('Content-Security-Policy') < staticHtml.indexOf('<script>'))
  assert.ok(!staticHtml.includes('frame-ancestors'))
  assert.ok(!contentSecurityPolicy(html, 'javascript:alert(1)').includes('javascript:'))
})

test('production SSR returns working script hashes and security headers', { timeout: 30000 }, async () => {
  const server = await startServer()
  try {
    const response = await fetch(`${server.base}/en/contact`)
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('x-frame-options'), 'DENY')
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
    assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin')
    const html = await response.text()
    assert.equal(response.headers.get('content-security-policy'), contentSecurityPolicy(html))
  }
  finally { await server.stop() }
})
