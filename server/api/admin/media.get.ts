import { requireSession } from '../../cms/auth'
import type { MediaItem } from '../../../types/cms'

/** The upload library, newest first. The bytes stay behind the image route. */
export default defineEventHandler((event): MediaItem[] => {
  const { db } = requireSession(event)
  const rows = db.prepare('SELECT name, width, height, length(data) AS bytes FROM media ORDER BY rowid DESC').all() as unknown as { name: string, width: number, height: number, bytes: number }[]
  return rows.map(row => ({ src: `/images/admin/${row.name}`, width: row.width, height: row.height, bytes: row.bytes }))
})
