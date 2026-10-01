import { requireSession } from '../../cms/auth'
import { limitedJson } from '../../cms/http'
import { reviseWorkspace, storedWorkspace } from '../../cms/store'
import { validateWorkspace } from '../../cms/validate'

export default defineEventHandler(async (event) => {
  const { db } = requireSession(event, true)
  const body = await limitedJson(event, 1024)
  validateWorkspace(JSON.parse(storedWorkspace(db).draft), db, true)
  return reviseWorkspace(db, body.revision, 'publish')
})
