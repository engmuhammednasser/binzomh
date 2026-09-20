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

export interface HomeHeroContent extends ContentBase {
  eyebrow: string
  headline: string
  description: string
  primaryCta: CtaLink
  secondaryCta?: CtaLink
}

export interface HomeBrandsContent extends ContentBase {
  eyebrow: string
  heading: string
  intro: string
  /** Rendered as visible fine print — the roster/relationship caveat. */
  disclaimer: string
  cta?: CtaLink
}

export interface HomeAboutContent extends ContentBase {
  eyebrow: string
  heading: string
  body: string
  /** Short focus tags (distribution, beauty & health care, ...). */
  points: string[]
  cta?: CtaLink
}

export interface HomeCapabilityItem {
  number: string
  title: string
  description: string
}

export interface HomeCapabilitiesContent extends ContentBase {
  eyebrow: string
  heading: string
  intro: string
  items: HomeCapabilityItem[]
  cta?: CtaLink
}

export interface HomeNetworkContent extends ContentBase {
  eyebrow: string
  heading: string
  intro: string
  channels: string[]
  cta?: CtaLink
}

export interface HomePartnershipContent extends ContentBase {
  heading: string
  cta: CtaLink
}

/**
 * H06 (metrics) is intentionally not modeled here — every candidate figure
 * is status: blocked for public display (see
 * docs/unresolved-content-approvals.md item 5), so N02 omits the section
 * entirely rather than typing a field nothing may legitimately fill in.
 */
export interface HomeContent extends ContentBase {
  hero: HomeHeroContent
  brands: HomeBrandsContent
  about: HomeAboutContent
  capabilities: HomeCapabilitiesContent
  network: HomeNetworkContent
  partnership: HomePartnershipContent
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
