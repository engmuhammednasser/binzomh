import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, resolve, sep } from 'node:path'
import test from 'node:test'
import { contentSecurityPolicy } from '../../server/utils/security-policy.ts'

const root = resolve('.output/public')
const base = (process.env.E2E_BASE_PATH || '/').replace(/\/$/, '')
const files = readdirSync(root, { recursive: true }).filter(file => file.endsWith('.html'))

test('all generated HTML contains a CSP matching its actual bootstrap scripts', () => {
  assert.ok(files.length >= 19, 'Expected both locales and the language entry page')
  for (const file of files) {
    const html = readFileSync(join(root, file), 'utf8')
    const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/i)?.[1]
    assert.ok(policy, `Missing CSP in ${file}`)
    assert.equal(policy.replaceAll('&quot;', '"').replaceAll('&amp;', '&'), contentSecurityPolicy(html, '', true), file)
    assert.ok(!html.includes('/_contact-test'), `Test endpoint leaked into ${file}`)
    assert.ok(!html.includes('admin-panel'), `Admin UI leaked into ${file}`)
  }
})

test('sitemap entries resolve to localized HTML with matching canonical URLs', () => {
  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8')
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
  assert.equal(new Set(urls).size, urls.length)
  assert.ok(urls.length >= 18)
  for (const url of urls) {
    const path = new URL(url).pathname
    assert.ok(path.startsWith(`${base}/en`) || path.startsWith(`${base}/ar`), path)
    const file = resolve(root, `.${path.slice(base.length)}`, 'index.html')
    assert.ok(file.startsWith(root + sep))
    const html = readFileSync(file, 'utf8')
    assert.ok(html.includes(`rel="canonical" href="${url}"`), url)
    assert.equal((html.match(/<h1\b/g) || []).length, 1, path)
  }
})

test('the generated entry preserves the base path and all local asset targets exist', () => {
  const entry = readFileSync(join(root, 'index.html'), 'utf8')
  assert.ok(entry.includes(`href="${base}/ar"`))
  assert.ok(entry.includes(`src="${base}/locale-redirect.js"`))
  assert.ok(!entry.includes('http-equiv="refresh"'))
  for (const file of files) {
    const html = readFileSync(join(root, file), 'utf8')
    for (const match of html.matchAll(/(?:src|href)="([^"?#]+)[^"]*"/g)) {
      const url = match[1]
      if (!url.startsWith(`${base}/`) || !/\.(?:js|css|png|jpe?g|webp|avif|svg|ico|woff2)$/.test(url)) continue
      assert.ok(existsSync(join(root, url.slice(base.length))), `${file} -> ${url}`)
    }
  }
})
