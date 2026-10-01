import { requireSession } from '../../cms/auth'
import { limitedJson, stringValue, invalid } from '../../cms/http'
import type { Enquiry } from '../../../types/cms'

export default defineEventHandler(async (event) => {
  const { db } = requireSession(event, true)
  const body = await limitedJson(event, 1024)
  const id = stringValue(body.id, 'id', 100)
  if (!['new', 'replied', 'archived'].includes(String(body.status))) invalid('Invalid status')
  const row = db.prepare('SELECT data FROM enquiries WHERE id=?').get(id) as { data: string } | undefined
  if (!row) throw createError({ statusCode: 404 })
  const data: Enquiry = JSON.parse(row.data)
  if (data.status !== body.previous) throw createError({ statusCode: 409, statusMessage: 'Enquiry changed. Refresh the inbox.' })
  data.status = body.status as Enquiry['status']
  db.prepare('UPDATE enquiries SET data=? WHERE id=?').run(JSON.stringify(data), id)
  return data
})
