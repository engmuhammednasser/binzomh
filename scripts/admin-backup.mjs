import { backup } from 'node:sqlite'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { openDatabase } from '../server/cms/database.ts'

const source = resolve(process.env.NUXT_ADMIN_DB_PATH || '.data/admin.sqlite')
if (!existsSync(source)) throw new Error('No dashboard database exists at the configured path.')
const destination = resolve(process.argv[2] || `.data/backups/admin-${new Date().toISOString().replaceAll(':', '-')}.sqlite`)
if (existsSync(destination) || source === destination) throw new Error('Choose a new backup file; existing files are never overwritten.')
mkdirSync(dirname(destination), { recursive: true, mode: 0o700 })
const db = openDatabase(source)
try {
  await backup(db, destination)
  console.log(`Consistent database backup saved to ${destination}`)
}
finally { db.close() }
