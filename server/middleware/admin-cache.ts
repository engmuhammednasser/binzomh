export default defineEventHandler((event) => {
  if (/\/admin(?:\/|$)/.test(getRequestURL(event).pathname) || getQuery(event).preview === '1') {
    setHeader(event, 'Cache-Control', 'private, no-store')
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
  }
})
