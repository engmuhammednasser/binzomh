import { createError, getHeader, getRequestURL, type H3Event } from 'h3'

/** Stream-limit bodies, including chunked uploads; Content-Length alone is not trusted. */
export async function limitedBody(event: H3Event, limit: number): Promise<Buffer> {
  if (Number(getHeader(event, 'content-length')) > limit) throw createError({ statusCode: 413, statusMessage: 'Request too large' })
  const chunks: Buffer[] = []
  let length = 0
  for await (const chunk of event.node.req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    length += buffer.length
    if (length > limit) throw createError({ statusCode: 413, statusMessage: 'Request too large' })
    chunks.push(buffer)
  }
  return Buffer.concat(chunks)
}
export async function limitedJson(event: H3Event, limit = 1024 * 1024): Promise<Record<string, unknown>> {
  if (getHeader(event, 'content-type')?.split(';')[0] !== 'application/json') throw createError({ statusCode: 415, statusMessage: 'JSON required' })
  const body = await limitedBody(event, limit)
  try {
    const value: unknown = JSON.parse(body.toString('utf8'))
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error()
    return value as Record<string, unknown>
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid JSON' })
  }
}
export function sameOrigin(event: H3Event, configuredOrigin: string) {
  const expected = configuredOrigin || getRequestURL(event, { xForwardedHost: false, xForwardedProto: false }).origin
  if (getHeader(event, 'origin') !== expected || getHeader(event, 'sec-fetch-site') === 'cross-site') {
    throw createError({ statusCode: 403, statusMessage: 'Origin rejected' })
  }
}
export const invalid = (message: string): never => {
  throw createError({ statusCode: 422, statusMessage: message })
}
export function stringValue(value: unknown, label: string, max = 8000): string {
  if (typeof value !== 'string' || value.length > max || [...value].some(char => char.charCodeAt(0) < 32 && !['\n', '\r', '\t'].includes(char))) invalid(`Invalid ${label}`)
  return value as string
}
export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid('Invalid object')
  return value as Record<string, unknown>
}
