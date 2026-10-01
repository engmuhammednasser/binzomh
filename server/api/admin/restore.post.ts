import { requireSession } from '../../cms/auth'
import { limitedJson } from '../../cms/http'
import { reviseWorkspace } from '../../cms/store'

export default defineEventHandler(async (event) => {
  const { db } = requireSession(event, true)
  const body = await limitedJson(event, 1024)
  if (!Number.isSafeInteger(body.target)) throw createError({ statusCode: 422 })
  const row = db.prepare('SELECT draft FROM revisions WHERE id=?').get(body.target as number) as { draft: string } | undefined
  if (!row) throw createError({ statusCode: 404 })
  return reviseWorkspace(db, body.revision, 'restore', JSON.parse(row.draft))
})
