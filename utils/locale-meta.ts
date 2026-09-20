/**
 * Display metadata for the supported locales, used by UI (e.g. the
 * language switcher) that needs a native name independent of routing.
 * The routing/detection rules themselves live in nuxt.config.ts under
 * `i18n` — this file never duplicates those.
 */
export interface LocaleMeta {
  code: 'en' | 'ar'
  dir: 'ltr' | 'rtl'
  nativeName: string
}

export const LOCALE_META: LocaleMeta[] = [
  { code: 'en', dir: 'ltr', nativeName: 'English' },
  { code: 'ar', dir: 'rtl', nativeName: 'العربية' },
]
