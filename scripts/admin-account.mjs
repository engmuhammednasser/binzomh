import { randomBytes } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { openDatabase } from '../server/cms/database.ts'
import { hashPassword } from '../server/cms/password.ts'

const email = process.argv.find(arg => arg.startsWith('--email='))?.slice(8)?.trim().toLowerCase()
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Usage: npm run admin:account -- --email=owner@example.com [--reset]')
const db = openDatabase(process.env.NUXT_ADMIN_DB_PATH || '.data/admin.sqlite')
try {
  if (db.prepare('SELECT email FROM users').get() && !process.argv.includes('--reset')) throw new Error('An owner already exists. Use --reset deliberately to replace credentials and revoke every session.')
  const password = randomBytes(24).toString('base64url')
  const hash = await hashPassword(password)
  const credentials = resolve('.data/admin-local-access.txt')
  // Write before changing the account, so an unwritable destination cannot lock out the owner.
  writeFileSync(credentials, `Email: ${email}\nPassword: ${password}\n`, { mode: 0o600 })
  db.exec('BEGIN IMMEDIATE')
  try {
    db.exec('DELETE FROM sessions; DELETE FROM users; DELETE FROM attempts;')
    db.prepare('INSERT INTO users(email,password) VALUES(?,?)').run(email, hash)
    db.exec('COMMIT')
  }
  catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
  console.log(`Owner configured. Credentials saved locally to ${credentials}. Store them securely and remove this file after reading.`)
}
finally { db.close() }
