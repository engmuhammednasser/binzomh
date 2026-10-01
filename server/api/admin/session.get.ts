import { requireSession } from '../../cms/auth'

export default defineEventHandler((event) => {
  const { session } = requireSession(event)
  return { email: session.email, csrf: session.csrf }
})
