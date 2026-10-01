import { randomBytes } from 'node:crypto'
import { writeFileSync, unlinkSync } from 'node:fs'
import { resolve } from 'node:path'
import { openDatabase } from '../../server/cms/database.ts'
import { hashPassword } from '../../server/cms/password.ts'

const path = resolve('.data/admin-browser-tests.sqlite')
for (const file of [path, `${path}-wal`, `${path}-shm`]) {
  try {
    unlinkSync(file)
  }
  catch (error) { if (error.code !== 'ENOENT') throw error }
}
const db = openDatabase(path)
const password = randomBytes(24).toString('base64url')
db.prepare('INSERT INTO users VALUES(?,?)').run('browser@example.com', await hashPassword(password))
db.close()
writeFileSync('.data/admin-browser-credentials.json', JSON.stringify({ email: 'browser@example.com', password }), { mode: 0o600 })
process.env.NUXT_ADMIN_DB_PATH = path
process.env.NUXT_ADMIN_ENABLED = 'true'
process.env.NUXT_ADMIN_SECURE_COOKIES = 'false'
process.env.NUXT_PUBLIC_CONTACT_FORM_ENDPOINT = ''
await import('../../.output/server/index.mjs')
