import { contentSecurityPolicy, securityHeaders } from '../utils/security-policy'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    if (import.meta.dev) return
    response.headers = { ...response.headers, ...securityHeaders }
    if (typeof response.body === 'string' && /<html\b/i.test(response.body)) {
      const config = useRuntimeConfig(event)
      response.headers['content-security-policy'] = contentSecurityPolicy(response.body, String(config.public.contactFormEndpoint || ''))
    }
  })
})
