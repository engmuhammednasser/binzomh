export function preferredLocale(cookie, languages) {
  const stored = cookie.split(';').map(part => part.trim()).find(part => part.startsWith('binzomh_locale='))
  if (stored) {
    try {
      const value = decodeURIComponent(stored.slice('binzomh_locale='.length))
      if (value === 'en' || value === 'ar') return value
    }
    catch { /* Ignore a malformed preference and try the browser language. */ }
  }
  for (const language of languages) {
    const value = language.toLowerCase().split('-')[0]
    if (value === 'en' || value === 'ar') return value
  }
  return 'en'
}

if (typeof document !== 'undefined') {
  const locale = preferredLocale(document.cookie, navigator.languages)
  const link = document.querySelector(`[data-locale="${locale}"]`)
  if (link) {
    const target = new URL(link.href)
    // Destinations are generated local links, never a URL taken from the cookie.
    if (target.origin === location.origin) location.replace(target.pathname + location.search + location.hash)
  }
}
