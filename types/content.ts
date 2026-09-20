/**
 * Typed content models for the Binzomah corporate site.
 *
 * These describe editorial/business content only — UI chrome strings
 * (navigation labels, buttons, aria labels) live in locales/en.json and
 * locales/ar.json via the i18n module instead.
 *
 * `status` records the approval state carried over from the source
 * project's editorial register (see docs/unresolved-content-approvals.md):
 *   - "approved": cleared for public publication as written.
 *   - "draft":    reviewable, not yet approved.
 *   - "blocked":  cannot publish until a specific open decision is resolved.
 *   - "missing":  no source content exists yet.
 *
 * Never change draft/blocked copy into "approved" without a corresponding,
 * dated approval recorded in the source register.
 */

export type LocaleCode = 'en' | 'ar'

export type ContentStatus = 'approved' | 'draft' | 'blocked' | 'missing'

export interface CtaLink {
  label: string
  /** Locale-neutral path stem, e.g. "/contact". Resolve with localePath(). */
  to: string
}

export interface ContentBase {
  status: ContentStatus
  /** Short internal note on why content is draft/blocked. Never rendered publicly. */
  note?: string
}

export interface HomeContent extends ContentBase {
  title: string
  intro: string
  primaryCta?: CtaLink
  secondaryCta?: CtaLink
}

export interface AboutContent extends ContentBase {
  title: string
  intro: string
}

export interface CapabilitiesContent extends ContentBase {
  title: string
  intro: string
}

export interface NetworkContent extends ContentBase {
  title: string
  intro: string
}

export interface ContactContent extends ContentBase {
  title: string
  intro: string
  /** Left undefined until the company confirms current, publishable details. */
  address?: string
  phone?: string
  email?: string
}

export interface BrandContent extends ContentBase {
  slug: string
  name: string
  introduction?: string
  relationship?: string
  /** Path under /logos, only ever an approved production asset — never a
   *  presentation-deck extraction. */
  logo?: string
  officialUrl?: string
}
