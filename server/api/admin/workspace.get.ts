import { requireSession } from '../../cms/auth'
import { workspaceResponse } from '../../cms/store'

export default defineEventHandler(event => workspaceResponse(requireSession(event).db))
