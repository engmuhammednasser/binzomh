import { requireSession } from '../../cms/auth'
import { limitedJson } from '../../cms/http'
import { reviseWorkspace } from '../../cms/store'
import { validateWorkspace } from '../../cms/validate'

export default defineEventHandler(async (event) => {
  const { db } = requireSession(event, true)
  const body = await limitedJson(event)
  return reviseWorkspace(db, body.revision, 'save', validateWorkspace(body.draft, db))
})
