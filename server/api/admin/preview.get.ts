import { requireSession } from '../../cms/auth'
import { storedWorkspace } from '../../cms/store'
import { publicWorkspace } from '../../cms/seed'

export default defineEventHandler(event => publicWorkspace(JSON.parse(storedWorkspace(requireSession(event).db).draft)))
