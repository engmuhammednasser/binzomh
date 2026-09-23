/**
 * Display metadata for the supported locales, used by UI (e.g. the
 * language switcher) that needs a native name independent of routing.
 * The routing/detection rules themselves live in nuxt.config.ts under
 * `i18n` — this file never duplicates those.
 */
export interface LocaleMeta {
  code: 'en' | 'ar'
  dir: 'ltr' | 'rtl'
  /**
   * Full name written in its own language. Stays the accessible name in
   * the switcher and the value in any prose about the locale — shortLabel
   * is a visual abbreviation, not a replacement for it.
   */
  nativeName: string
  /**
   * Compact two-letter label for the switcher. Latin in both locales on
   * purpose: these read as standard language codes rather than as words,
   * so they need no translation and keep the control the same width in
   * LTR and RTL.
   */
  shortLabel: string
}

export const LOCALE_META: LocaleMeta[] = [
  { code: 'en', dir: 'ltr', nativeName: 'English', shortLabel: 'EN' },
  { code: 'ar', dir: 'rtl', nativeName: 'العربية', shortLabel: 'AR' },
]
