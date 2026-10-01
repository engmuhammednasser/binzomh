import { endSession } from '../../cms/auth'

export default defineEventHandler(event => endSession(event))
