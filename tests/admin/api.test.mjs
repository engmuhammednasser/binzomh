import assert from 'node:assert/strict'
import test from 'node:test'
import { randomUUID } from 'node:crypto'
import { unlink } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { openDatabase } from '../../server/cms/database.ts'
import { hashPassword, tokenHash } from '../../server/cms/password.ts'
import { startServer } from '../helpers/server.mjs'

test('authenticated dashboard: authorization, drafts, publication, media, persistence and revocation', { timeout: 90000 }, async (t) => {
  const path = resolve(`.data/admin-api-${randomUUID()}.sqlite`)
  const db = openDatabase(path)
  const password = randomUUID() + randomUUID()
  db.prepare('INSERT INTO users VALUES(?,?)').run('owner@example.com', await hashPassword(password))
  db.close()
  const env = { NUXT_ADMIN_ENABLED: 'true', NUXT_ADMIN_DB_PATH: path, NUXT_ADMIN_SECURE_COOKIES: 'false' }
  let server = await startServer(undefined, env)
  let cookie = ''
  let csrf = ''
  async function request(path, method = 'GET', body, options = {}) {
    const headers = { ...(cookie ? { cookie } : {}), 'origin': server.base, 'x-csrf-token': csrf, ...options.headers }
    if (body !== undefined) headers['content-type'] ??= 'application/json'
    return fetch(server.base + path, { method, redirect: 'manual', headers, ...(body !== undefined ? { body: Buffer.isBuffer(body) ? body : JSON.stringify(body) } : {}) })
  }
  async function login() {
    const response = await request('/api/admin/login', 'POST', { email: 'owner@example.com', password })
    assert.equal(response.status, 200)
    const header = response.headers.get('set-cookie')
    assert.match(header, /HttpOnly/i)
    assert.match(header, /SameSite=Strict/i)
    cookie = header.split(';')[0]
    csrf = (await response.json()).csrf
  }
  let workspace
  let original
  let image
  let logo
  try {
    await t.test('every private endpoint rejects anonymous requests and dashboard SSR redirects', async () => {
      for (const [path, method] of [['workspace', 'GET'], ['workspace', 'PUT'], ['publish', 'POST'], ['restore', 'POST'], ['preview', 'GET'], ['enquiries', 'GET'], ['enquiries', 'POST'], ['enquiries', 'PATCH'], ['media', 'GET'], ['media', 'POST'], ['logout', 'POST']]) {
        assert.equal((await request(`/api/admin/${path}`, method, method === 'GET' ? undefined : {})).status, 401, path)
      }
      for (const locale of ['en', 'ar']) {
        const response = await request(`/${locale}/admin`)
        assert.equal(response.status, 302)
        assert.equal(response.headers.get('location'), `/${locale}/admin/login`)
      }
      assert.equal((await request('/en?preview=1')).status, 401)
    })
    await t.test('login uses generic failures and rejects foreign origins', async () => {
      assert.equal((await request('/api/admin/login', 'POST', { email: 'owner@example.com', password: 'wrong' })).status, 401)
      assert.equal((await request('/api/admin/login', 'POST', { email: 'owner@example.com', password }, { headers: { origin: 'https://evil.example' } })).status, 403)
      await login()
      const html = await request('/en/admin')
      assert.equal(html.status, 200, await html.clone().text())
      assert.match(html.headers.get('cache-control'), /no-store/)
      assert.match(await html.text(), /<h1[^>]*>Your work, at a glance<\/h1>/)
      workspace = await (await request('/api/admin/workspace')).json()
      original = structuredClone(workspace.draft)
    })
    await t.test('CSRF, oversized bodies and invalid schema cannot mutate data', async () => {
      assert.equal((await request('/api/admin/workspace', 'PUT', {}, { headers: { 'x-csrf-token': '' } })).status, 403)
      assert.equal((await request('/api/admin/workspace', 'PUT', {}, { headers: { origin: 'https://evil.example' } })).status, 403)
      assert.equal((await request('/api/admin/workspace', 'PUT', { padding: 'a'.repeat(1024 * 1024) })).status, 413)
      const invalid = structuredClone(original)
      invalid.copy.home[0].path = '__proto__.polluted'
      assert.equal((await request('/api/admin/workspace', 'PUT', { revision: workspace.revision, draft: invalid })).status, 422)
      invalid.copy = original.copy
      invalid.social.instagram = 'javascript:alert(1)'
      assert.equal((await request('/api/admin/workspace', 'PUT', { revision: workspace.revision, draft: invalid })).status, 422)
    })
    await t.test('save is private; conflicts preserve newer edits; unpublished brand claims are redacted', async () => {
      workspace.draft.copy.home.find(row => row.path === 'hero.headline').en = 'Persisted review heading'
      workspace.draft.brands[0].introduction = { status: 'draft', content: { en: 'PRIVATE-CLAIM', ar: 'نص خاص' } }
      const stale = workspace.revision
      const response = await request('/api/admin/workspace', 'PUT', { revision: stale, draft: workspace.draft })
      assert.equal(response.status, 200)
      workspace = await response.json()
      assert.equal((await request('/api/admin/workspace', 'PUT', { revision: stale, draft: original })).status, 409)
      assert.ok(!(await (await request('/api/content')).text()).includes('Persisted review heading'))
      const preview = await (await request('/api/admin/preview')).text()
      assert.ok(preview.includes('Persisted review heading'))
      assert.ok(!preview.includes('PRIVATE-CLAIM'))
      const responseHtml = await request('/en?preview=1')
      assert.equal(responseHtml.status, 200)
      assert.match(responseHtml.headers.get('cache-control'), /no-store/)
      assert.match(await responseHtml.text(), /Persisted review heading/)
    })
    await t.test('image uploads decode and re-encode rasters and protect unpublished assets', async () => {
      assert.equal((await request('/api/admin/media', 'POST', Buffer.from('<svg onload="alert(1)"/>'), { headers: { 'content-type': 'image/png' } })).status, 422)
      const input = await sharp({ create: { width: 600, height: 400, channels: 3, background: '#b8d9cc' } }).png().toBuffer()
      const response = await request('/api/admin/media', 'POST', input, { headers: { 'content-type': 'image/png' } })
      assert.equal(response.status, 200)
      image = await response.json()
      assert.equal((await fetch(server.base + image.src)).status, 401)
      assert.equal((await request(image.src)).headers.get('content-type'), 'image/webp')
      workspace.draft.slots['home-hero'] = image
      workspace = await (await request('/api/admin/workspace', 'PUT', { revision: workspace.revision, draft: workspace.draft })).json()
    })
    await t.test('logos accept uploads or approved logo files only; drafts saved before logos still load', async () => {
      const connection = openDatabase(path)
      connection.prepare(`UPDATE workspace SET draft=json_remove(draft, '$.logos')`).run()
      connection.close()
      const legacy = await (await request('/api/admin/workspace')).json()
      assert.deepEqual(legacy.draft.logos, original.logos)
      delete legacy.draft.logos
      const saved = await request('/api/admin/workspace', 'PUT', { revision: legacy.revision, draft: legacy.draft })
      assert.equal(saved.status, 200)
      workspace = await saved.json()
      assert.deepEqual(workspace.draft.logos, original.logos)

      const input = await sharp({ create: { width: 320, height: 160, channels: 4, background: { r: 20, g: 60, b: 50, alpha: 0 } } }).png().toBuffer()
      logo = await (await request('/api/admin/media', 'POST', input, { headers: { 'content-type': 'image/png' } })).json()
      const library = await (await request('/api/admin/media')).json()
      assert.deepEqual(library.map(item => item.src), [logo.src, image.src])
      assert.ok(library.every(item => item.bytes > 0))

      const zoa = '/logos/brands/zoa.png'
      for (const src of ['/images/home/hero.png', '/images/admin/00000000-0000-0000-0000-000000000000.webp', '/logos/../secret.png']) {
        const invalid = structuredClone(workspace.draft)
        invalid.logos[zoa] = { src, width: 1, height: 1 }
        assert.equal((await request('/api/admin/workspace', 'PUT', { revision: workspace.revision, draft: invalid })).status, 422, src)
      }
      workspace.draft.logos[zoa] = { src: logo.src, width: 9999, height: 9999 }
      workspace.draft.logos['/logos/partners/nahdi.png'] = { src: '/logos/partners/al-dawaa.png', width: 1, height: 1 }
      workspace = await (await request('/api/admin/workspace', 'PUT', { revision: workspace.revision, draft: workspace.draft })).json()
      assert.deepEqual(workspace.draft.logos[zoa], { src: logo.src, width: 320, height: 160 })
      assert.deepEqual(workspace.draft.logos['/logos/partners/nahdi.png'], original.logos['/logos/partners/al-dawaa.png'])
      assert.equal((await fetch(server.base + logo.src)).status, 401)
      assert.ok(!(await (await request('/api/content')).text()).includes(logo.src))
    })
    await t.test('drafts saved before a page field, image slot or brand file changed still load and save', async () => {
      // As saved before the fourth home capability and its image slot
      // existed, and while Embryolisse still used its earlier logo file.
      const connection = openDatabase(path)
      const stored = JSON.parse(connection.prepare('SELECT draft FROM workspace WHERE id=1').get().draft)
      const isNew = row => row.path.startsWith('capabilities.items.3.')
      stored.copy.home = stored.copy.home.filter(row => !isNew(row))
      delete stored.slots['home-capabilities-4']
      stored.brands[0].logo = { src: '/logos/brands/embryolisse.png', width: 630, height: 630 }
      stored.brands[0].name = 'Embryolisse (edited)'
      connection.prepare('UPDATE workspace SET draft=?, published=? WHERE id=1').run(JSON.stringify(stored), JSON.stringify(stored))
      connection.close()
      const legacy = await (await request('/api/admin/workspace')).json()
      assert.deepEqual(legacy.draft.copy.home.map(row => row.path), original.copy.home.map(row => row.path))
      assert.deepEqual(legacy.draft.copy.home.filter(row => !isNew(row)), stored.copy.home, 'saved values are kept')
      assert.deepEqual(legacy.draft.copy.home.filter(isNew), original.copy.home.filter(isNew))
      assert.equal(legacy.draft.slots['home-capabilities-4'], null)
      assert.deepEqual(legacy.draft.brands[0].logo, original.brands[0].logo, 'the logo file reads from the code')
      assert.equal(legacy.draft.brands[0].name, 'Embryolisse (edited)', 'the edited name is kept')
      const published = await (await request('/api/content')).json()
      assert.deepEqual(published.brands[0].logo, original.brands[0].logo)
      legacy.draft.brands[0].name = original.brands[0].name
      const saved = await request('/api/admin/workspace', 'PUT', { revision: legacy.revision, draft: legacy.draft })
      assert.equal(saved.status, 200)
      workspace = await saved.json()
    })
    await t.test('publication changes SSR and public media, while draft claims remain private', async () => {
      const response = await request('/api/admin/publish', 'POST', { revision: workspace.revision })
      assert.equal(response.status, 200, await response.clone().text())
      workspace = await response.json()
      const html = await (await fetch(server.base + '/en')).text()
      assert.match(html, /Persisted review heading/)
      assert.ok(!html.includes('PRIVATE-CLAIM'))
      assert.equal((await fetch(server.base + image.src)).status, 200)
      // A published logo reaches every page that shows it and becomes public.
      assert.ok(html.includes(logo.src))
      assert.ok((await (await fetch(server.base + '/en/brands')).text()).includes(logo.src))
      assert.equal((await fetch(server.base + logo.src)).status, 200)
    })
    await t.test('real inbox starts empty, persists records, and prevents stale status updates', async () => {
      assert.deepEqual(await (await request('/api/admin/enquiries')).json(), [])
      const response = await request('/api/admin/enquiries', 'POST', { name: 'QA enquiry', email: 'qa@example.com', message: 'Locally generated integration test' })
      assert.equal(response.status, 200)
      const enquiry = await response.json()
      assert.equal((await request('/api/admin/enquiries', 'PATCH', { id: enquiry.id, previous: 'new', status: 'replied' })).status, 200)
      assert.equal((await request('/api/admin/enquiries', 'PATCH', { id: enquiry.id, previous: 'new', status: 'archived' })).status, 409)
      assert.equal((await request('/api/admin/enquiries', 'PATCH', { id: enquiry.id, previous: 'replied', status: 'invalid' })).status, 422)
    })
    await t.test('restart retains data and sessions; restoring the initial revision does not publish it', async () => {
      await server.stop()
      server = await startServer(undefined, env)
      const saved = await (await request('/api/admin/workspace')).json()
      assert.equal(saved.revision, workspace.revision)
      assert.equal((await (await request('/api/admin/enquiries')).json()).length, 1)
      const restored = await request('/api/admin/restore', 'POST', { revision: saved.revision, target: 0 })
      assert.equal(restored.status, 200)
      const result = await restored.json()
      assert.deepEqual(result.draft, original)
      assert.ok((await (await request('/api/content')).text()).includes('Persisted review heading'))
    })
    await t.test('session expiry, logout and login throttling are enforced server-side', async () => {
      const connection = openDatabase(path)
      connection.prepare('UPDATE sessions SET touched=0 WHERE hash=?').run(tokenHash(cookie.split('=')[1]))
      connection.close()
      assert.equal((await request('/api/admin/session')).status, 401)
      await login()
      assert.equal((await request('/api/admin/logout', 'POST', {})).status, 200)
      assert.equal((await request('/api/admin/workspace')).status, 401)
      for (let n = 0; n < 8; n++) assert.equal((await request('/api/admin/login', 'POST', { email: 'missing@example.com', password: 'wrong' })).status, 401)
      assert.equal((await request('/api/admin/login', 'POST', { email: 'owner@example.com', password })).status, 429)
    })
  }
  finally {
    await server.stop()
    for (const file of [path, `${path}-wal`, `${path}-shm`]) await unlink(file).catch(() => {})
  }
})
