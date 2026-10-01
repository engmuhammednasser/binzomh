import en from '../../i18n/en.json'
import ar from '../../i18n/ar.json'

/**
 * Registers the dashboard's UI strings on the active i18n instance.
 *
 * They are kept out of the site's own locale files on purpose: those are
 * loaded on every public page, so anything in them ships to every visitor.
 * Imported here instead, the strings travel with the only two entry points
 * that call this — layouts/admin.vue and pages/admin/login.vue — and leave
 * the public-only production bundle together with them (see modules/dev-only.ts).
 *
 * Called during setup, which runs on the server and again in the browser
 * before anything renders, so both sides translate from the same messages
 * and hydration matches. Merging again on a later navigation is a no-op.
 *
 * Re-merged on every locale change as well: the layout stays mounted when
 * the language switcher swaps /en/admin for /ar/admin, so its setup does
 * not run again, while the i18n module may load the newly active locale's
 * site messages at that point.
 */
export function useAdminMessages() {
  const { locale, mergeLocaleMessage } = useI18n()
  const merge = () => {
    mergeLocaleMessage('en', en)
    mergeLocaleMessage('ar', ar)
  }
  merge()
  watch(locale, merge, { flush: 'sync' })
}
