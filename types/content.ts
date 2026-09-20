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

export interface AboutHeroContent extends ContentBase {
  eyebrow: string
  heading: string
  intro: string
}

export interface AboutOverviewContent extends ContentBase {
  eyebrow: string
  heading: string
  body: string
}

export interface AboutTimelineEntry {
  year: string
  description: string
}

/**
 * The chronology remains company-confirmation-required (see
 * docs/unresolved-content-approvals.md item 4) — `timeline` presents the
 * documented sequence only, never rolled up into a resolved "Founded in…"
 * claim. `disclaimer` is visible fine print, not an internal note.
 */
export interface AboutStoryContent extends ContentBase {
  eyebrow: string
  heading: string
  intro: string
  timeline: AboutTimelineEntry[]
  disclaimer: string
}

export interface AboutVisionMissionContent extends ContentBase {
  eyebrow: string
  heading: string
  visionLabel: string
  vision: string
  missionLabel: string
  mission: string
}

export interface AboutStrategyItem {
  number: string
  title: string
  description: string
}

export interface AboutStrategiesContent extends ContentBase {
  eyebrow: string
  heading: string
  items: AboutStrategyItem[]
}

/**
 * Chairman/team content stays structural only — `body` must never carry an
 * invented name, photo, or biography. The source register tracks this as
 * PENDING an explicit IA decision (feature on About? a future Leadership
 * page? omit?) — see docs/unresolved-content-approvals.md and the source
 * sitemap's "Newly discovered content" section.
 */
export interface AboutLeadershipContent extends ContentBase {
  eyebrow: string
  heading: string
  body: string
}

export interface AboutContent extends ContentBase {
  hero: AboutHeroContent
  overview: AboutOverviewContent
  story: AboutStoryContent
  visionMission: AboutVisionMissionContent
  strategies: AboutStrategiesContent
  leadership: AboutLeadershipContent
  cta?: CtaLink
}

export interface CapabilitiesHeroContent extends ContentBase {
  eyebrow: string
  heading: string
  intro: string
}

export interface CapabilitiesSectionItem extends ContentBase {
  number: string
  title: string
  summary: string
  body: string
  cta?: CtaLink
}

export interface CapabilitiesClosingContent extends ContentBase {
  heading: string
  cta: CtaLink
}

export interface CapabilitiesContent extends ContentBase {
  hero: CapabilitiesHeroContent
  sections: CapabilitiesSectionItem[]
  closing: CapabilitiesClosingContent
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
