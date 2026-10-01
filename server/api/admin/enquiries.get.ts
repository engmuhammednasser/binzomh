import { requireSession } from '../../cms/auth'
import type { Enquiry } from '../../../types/cms'

export default defineEventHandler((event) => {
  const { db } = requireSession(event)
  return (db.prepare('SELECT data FROM enquiries ORDER BY rowid DESC LIMIT 2000').all() as { data: string }[]).map(row => JSON.parse(row.data) as Enquiry)
})
