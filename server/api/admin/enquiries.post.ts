import { randomUUID } from 'node:crypto'
import { requireSession } from '../../cms/auth'
import { limitedJson, stringValue, invalid } from '../../cms/http'
import { validateEmail } from '../../../layers/admin/utils/contact-validation'
import type { Enquiry } from '../../../types/cms'

export default defineEventHandler(async (event) => {
  const { db } = requireSession(event, true)
  const body = await limitedJson(event, 16000)
  const name = stringValue(body.name, 'name', 150).trim()
  const email = stringValue(body.email, 'email', 254).trim()
  const company = stringValue(body.company ?? '', 'company', 200).trim()
  const message = stringValue(body.message, 'message', 8000).trim()
  if (!name || !message || validateEmail(email)) invalid('Complete the name, email and message')
  const row: Enquiry = { id: randomUUID(), name, email, company, message, receivedAt: new Date().toISOString(), status: 'new' }
  db.prepare('INSERT INTO enquiries VALUES(?,?)').run(row.id, JSON.stringify(row))
  return row
})
