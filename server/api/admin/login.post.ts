import { adminContext, startSession } from '../../cms/auth'
import { limitedJson, sameOrigin, stringValue } from '../../cms/http'
import { tokenHash, verifyPassword } from '../../cms/password'

export default defineEventHandler(async (event) => {
  const { db, config } = adminContext(event)
  sameOrigin(event, config.admin.origin)
  const key = tokenHash(event.node.req.socket.remoteAddress || 'local')
  const now = Date.now()
  db.prepare('DELETE FROM attempts WHERE until<?').run(now)
  const attempt = db.prepare('SELECT count FROM attempts WHERE key=?').get(key) as { count: number } | undefined
  if ((attempt?.count ?? 0) >= 8) {
    setHeader(event, 'Retry-After', 900)
    throw createError({ statusCode: 429, statusMessage: 'Too many attempts. Try again later.' })
  }
  db.prepare('INSERT INTO attempts VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1').run(key, now + 15 * 60 * 1000)
  const body = await limitedJson(event, 4096)
  const email = stringValue(body.email, 'email', 254).trim().toLowerCase()
  const password = stringValue(body.password, 'password', 1024)
  const user = db.prepare('SELECT password FROM users WHERE email=?').get(email) as { password: string } | undefined
  if (!await verifyPassword(password, user?.password)) throw createError({ statusCode: 401, statusMessage: 'Email or password is incorrect' })
  db.prepare('DELETE FROM attempts WHERE key=?').run(key)
  return startSession(event, email)
})
