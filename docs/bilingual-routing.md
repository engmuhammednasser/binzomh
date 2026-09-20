# Bilingual routing

Two locales: English (en, source/default/fallback) and Arabic (ar).
Configured in nuxt.config.ts under the i18n key, using @nuxtjs/i18n with
strategy: "prefix" (every locale is always prefixed; English does not get
an unprefixed alias).

Rule: explicit /en/... or /ar/... always wins.
Implementation: strategy "prefix" makes these real, independent routes,
never redirected by detection.

Rule: root / picks a locale.
Implementation: detectBrowserLanguage.redirectOn is "root", so detection
only runs at the unprefixed root.

Rule: a saved preference beats browser language.
Implementation: detectBrowserLanguage.useCookie is true (cookie name
binzomh_locale). The module checks the cookie before the Accept-Language
header.

Rule: an unsupported or missing preference falls back to English.
Implementation: defaultLocale is "en" and
detectBrowserLanguage.fallbackLocale is "en".

Rule: the switcher links to the translated equivalent of the current page.
Implementation: LanguageSwitcher.vue uses useSwitchLocalePath(), never a
hardcoded home link.

Rule: no fake link when a translation is missing.
Implementation: the same component renders a disabled, labelled span
instead of a link if switchLocalePath returns nothing. Not exercised
today, since every N01 page ships in both locales, but in place for when a
future page temporarily does not.

## RTL

ar is configured with dir: "rtl". The html lang and dir attributes are set
once, globally, in app.vue via useLocaleHead(). All CSS in
app/assets/css/ uses logical properties (inline-start, margin-inline,
padding-block, and so on) so layout, spacing, and the mobile nav drawers
side all flip automatically. There is no separate Arabic component tree,
and no manual RTL branching in component templates beyond a couple of
documented, deliberate exceptions: letter-spacing on .text-label, and the
ZDivider slant direction.

## SEO

usePageSeo() (in app/composables/) calls useLocaleHead with its default
SEO options on every page. i18n resolves localized canonical/hreflang/OG
paths, then usePageSeo applies runtimeConfig.public.siteUrl as their
origin. Arabic pages are never canonicalized to English. The production
origin is https://binzomah.net; NUXT_PUBLIC_SITE_URL overrides it for local
and staging deployments (see deployment-assumptions.md).
