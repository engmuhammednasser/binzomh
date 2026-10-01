export type ContactSuccessField = 'ok' | 'success'

/** The configured provider must explicitly acknowledge acceptance. */
export function isContactAccepted(body: unknown, successField: string): boolean {
  if ((successField !== 'ok' && successField !== 'success')
    || !body || typeof body !== 'object' || Array.isArray(body)) return false
  const reply = body as Record<string, unknown>
  const hasError = (value: unknown) => {
    if (Array.isArray(value)) return value.length > 0
    if (value && typeof value === 'object') return Object.keys(value).length > 0
    return Boolean(value)
  }
  return reply[successField] === true
    && reply.ok !== false && reply.success !== false
    && !hasError(reply.error) && !hasError(reply.errors)
}

export async function sendContactEnquiry(
  endpoint: string,
  data: FormData,
  successField: string,
  signal: AbortSignal,
  fetcher: typeof fetch = fetch,
) {
  const response = await fetcher(endpoint, {
    method: 'POST', body: data, headers: { Accept: 'application/json' }, signal,
  })
  if (!response.ok || response.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json') {
    throw new Error('Unexpected contact response')
  }
  if (!isContactAccepted(await response.json(), successField)) throw new Error('Enquiry was not accepted')
}
