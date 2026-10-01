import { createHash } from 'node:crypto'

export const securityHeaders = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
}

/** Hash Nuxt's rendered inline bootstrap/payload without permitting arbitrary inline JS. */
export function contentSecurityPolicy(html: string, endpoint = '', forMeta = false): string {
  const hashes = new Set<string>()
  for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)) {
    if (script[1]) hashes.add(`'sha256-${createHash('sha256').update(script[1]).digest('base64')}'`)
  }
  let contactOrigin = ''
  try {
    const url = new URL(endpoint)
    if (url.protocol === 'https:' || url.protocol === 'http:') contactOrigin = ` ${url.origin}`
  }
  catch { /* Empty or same-origin relative endpoints need only 'self'. */ }
  return [
    'default-src \'self\'',
    `script-src 'self' ${[...hashes].join(' ')}`.trim(),
    // Vue transitions and responsive components use style attributes.
    'style-src \'self\' \'unsafe-inline\'',
    'img-src \'self\' data:',
    'font-src \'self\'',
    `connect-src 'self'${contactOrigin}`,
    `form-action 'self'${contactOrigin}`,
    'object-src \'none\'',
    'base-uri \'self\'',
    ...(forMeta ? [] : ['frame-ancestors \'none\'']),
  ].join('; ')
}

export function withStaticCsp(html: string, endpoint = ''): string {
  const policy = contentSecurityPolicy(html, endpoint, true).replaceAll('&', '&amp;').replaceAll('"', '&quot;')
  return html.replace(/<head\b[^>]*>/i, head => `${head}<meta http-equiv="Content-Security-Policy" content="${policy}">`)
}
