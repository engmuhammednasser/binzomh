import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createServer } from 'node:net'
import process from 'node:process'
import test from 'node:test'
import { absoluteSiteUrl } from '../shared/utils/site-url.ts'

test('absolute site URLs preserve the configured origin and reject external paths', () => {
  assert.equal(absoluteSiteUrl('https://binzomah.net/', '/ar/about'), 'https://binzomah.net/ar/about')
  assert.equal(absoluteSiteUrl('http://localhost:3000', '/sitemap.xml'), 'http://localhost:3000/sitemap.xml')
  for (const origin of ['ftp://example.com', 'https://user:secret@example.com', 'https://example.com/path', 'https://example.com?query=1']) {
    assert.throws(() => absoluteSiteUrl(origin))
  }
  for (const path of ['//example.com', '/\\example.com', 'https://example.com']) {
    assert.throws(() => absoluteSiteUrl('https://binzomah.net', path))
  }
})

async function startServer(origin) {
  const reservation = createServer()
  reservation.listen(0, '127.0.0.1')
  await once(reservation, 'listening')
  const { port } = reservation.address()
  await new Promise(resolve => reservation.close(resolve))
  const env = { ...process.env, NITRO_HOST: '127.0.0.1', NITRO_PORT: String(port) }
  delete env.NUXT_PUBLIC_SITE_URL
  delete env.NITRO_UNIX_SOCKET
  if (origin) env.NUXT_PUBLIC_SITE_URL = origin
  const child = spawn(process.execPath, ['.output/server/index.mjs'], { env, stdio: ['ignore', 'pipe', 'pipe'] })
  let output = ''
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Server startup timed out: ${output}`)), 15000)
      child.once('error', (error) => {
        clearTimeout(timeout)
        reject(error)
      })
      child.once('exit', (code) => {
        clearTimeout(timeout)
        reject(new Error(`Server exited (${code}): ${output}`))
      })
      child.stderr.on('data', chunk => output += chunk)
      child.stdout.on('data', (chunk) => {
        output += chunk
        if (output.includes('Listening on')) {
          clearTimeout(timeout)
          resolve()
        }
      })
    })
  }
  catch (error) {
    child.kill()
    throw error
  }
  return {
    base: `http://127.0.0.1:${port}`,
    async stop() {
      if (child.exitCode !== null) return
      const closed = once(child, 'exit')
      child.kill()
      await closed
    },
  }
}

// Build once first. Every case reuses the same output to catch origins baked
// into HTML during build, as well as startup-only environment overrides.
for (const override of [undefined, 'http://localhost:3000', 'https://staging.binzomah.example']) {
  test(`server SEO uses ${override || 'the confirmed production default'}`, { timeout: 30000 }, async () => {
    const origin = override || 'https://binzomah.net'
    const server = await startServer(override)
    try {
      for (const path of ['/en', '/ar', '/en/about', '/ar/about']) {
        const response = await fetch(server.base + path)
        assert.equal(response.status, 200)
        const html = await response.text()
        const tags = [...html.matchAll(/<(?:link|meta)\b[^>]*>/g)].map(match => match[0])
        const canonical = tags.find(tag => tag.includes('rel="canonical"'))
        const ogUrl = tags.find(tag => tag.includes('property="og:url"'))
        assert.ok(canonical?.includes(`href="${origin}${path}"`), canonical)
        assert.ok(ogUrl?.includes(`content="${origin}${path}"`), ogUrl)
        const alternates = tags.filter(tag => tag.includes('rel="alternate"') && tag.includes('hreflang='))
        assert.ok(alternates.length >= 3)
        for (const tag of alternates) assert.ok(tag.includes(`href="${origin}/`), tag)
        const schema = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
          .map(match => JSON.parse(match[1])).find(item => item['@type'] === 'WebSite')
        assert.equal(schema?.url, `${origin}/`)
        assert.equal(schema?.['@id'], `${origin}/#website`)
      }
      const sitemap = await (await fetch(`${server.base}/sitemap.xml`)).text()
      const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])
      assert.equal(locations.length, 12)
      for (const location of locations) assert.equal(new URL(location).origin, origin)
      for (const match of sitemap.matchAll(/href="(.*?)"/g)) assert.equal(new URL(match[1]).origin, origin)
      assert.match(sitemap, /\/ar\/contact<\/loc>/)
      const robots = await (await fetch(`${server.base}/robots.txt`)).text()
      assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`))
      const root = await fetch(server.base, { redirect: 'manual', headers: { cookie: 'binzomh_locale=ar' } })
      assert.equal(root.status, 302, 'SSR root must not be frozen by prerendering')
      assert.match(root.headers.get('location'), /\/ar$/)
    }
    finally {
      await server.stop()
    }
  })
}
