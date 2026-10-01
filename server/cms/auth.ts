import { randomBytes, timingSafeEqual } from 'node:crypto'
import { createError, deleteCookie, getCookie, getHeader, setCookie, setHeader, type H3Event } from 'h3'
import { cmsDatabase } from './store'
import { tokenHash } from './password'
import { sameOrigin } from './http'

export function adminContext(event: H3Event) {
  const config = useRuntimeConfig(event)
  if (!config.admin.enabled) throw createError({ statusCode: 404 })
  setHeader(event, 'Cache-Control', 'private, no-store')
  setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
  return { db: cmsDatabase(config.admin.dbPath), config }
}
export function cookieOptions(event: H3Event) {
  const config = useRuntimeConfig(event)
  return { httpOnly: true, secure: Boolean(config.admin.secureCookies), sameSite: 'strict' as const, path: config.app.baseURL, maxAge: 8 * 3600 }
}
const cookieName = 'binzomh_session'
export function requireSession(event: H3Event, mutation = false) {
  const { db, config } = adminContext(event)
  const token = getCookie(event, cookieName) || ''
  const session = db.prepare('SELECT * FROM sessions WHERE hash=?').get(tokenHash(token)) as { hash: string, email: string, csrf: string, expires: number, touched: number } | undefined
  const now = Date.now()
  if (!session || session.expires <= now || session.touched < now - 30 * 60 * 1000) {
    if (session) db.prepare('DELETE FROM sessions WHERE hash=?').run(session.hash)
    deleteCookie(event, cookieName, cookieOptions(event))
    throw createError({ statusCode: 401, statusMessage: 'Sign in required' })
  }
  if (mutation) {
    sameOrigin(event, config.admin.origin)
    const csrf = Buffer.from(getHeader(event, 'x-csrf-token') || '')
    const expected = Buffer.from(session.csrf)
    if (csrf.length !== expected.length || !timingSafeEqual(csrf, expected)) throw createError({ statusCode: 403, statusMessage: 'Invalid security token' })
  }
  db.prepare('UPDATE sessions SET touched=? WHERE hash=?').run(now, session.hash)
  return { db, session, config }
}
export function startSession(event: H3Event, email: string) {
  const { db } = adminContext(event)
  const now = Date.now()
  db.prepare('DELETE FROM sessions WHERE expires<? OR touched<?').run(now, now - 30 * 60 * 1000)
  const old = getCookie(event, cookieName)
  if (old) db.prepare('DELETE FROM sessions WHERE hash=?').run(tokenHash(old))
  const token = randomBytes(32).toString('hex')
  const csrf = randomBytes(32).toString('hex')
  db.prepare('INSERT INTO sessions VALUES(?,?,?,?,?)').run(tokenHash(token), email, csrf, now + 8 * 3600 * 1000, now)
  setCookie(event, cookieName, token, cookieOptions(event))
  return { email, csrf }
}
export function endSession(event: H3Event) {
  const { db, session } = requireSession(event, true)
  db.prepare('DELETE FROM sessions WHERE hash=?').run(session.hash)
  deleteCookie(event, cookieName, cookieOptions(event))
  return { ok: true }
}
