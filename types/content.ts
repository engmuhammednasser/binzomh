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
  logosLabel?: string
  /** A curated preview only — the full roster lives on /network. See
   *  docs/unresolved-content-approvals.md item 9. */
  logos?: { name: string, logo: PartnerLogo }[]
  cta?: CtaLink
}

export interface HomePartnershipContent extends ContentBase {
  eyebrow?: string
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
 * Headquarters and regional positioning. Deliberately carries no coverage
 * figures: city counts, retail-point counts and every other company metric
 * stay blocked under docs/unresolved-content-approvals.md item 5.
 */
export interface AboutLocationContent extends ContentBase {
  eyebrow: string
  heading: string
  body: string
  /** Large display label for the HQ city, e.g. "Riyadh". */
  city: string
  /** Short qualifier shown under the city, e.g. "Headquarters". */
  cityLabel: string
  /** Street address — rendered only while approved; see item 6. */
  address?: string
}

/**
 * A named person shown on the About page. Every field is real, sourced
 * content — never an invented name, title, quote or portrait.
 *
 * `photo` must point at a file copied byte-for-byte from the company
 * profile's own asset library into public/images/about/. Publication of
 * these names and portraits was approved by the owner on 2026-09-23 — see
 * docs/unresolved-content-approvals.md item 10. Do not add a person here
 * who that approval does not cover.
 */
export interface AboutPerson {
  /** Stable key for list rendering; also the portrait's file stem. */
  slug: string
  name: string
  role: string
  photo: `/images/about/${string}`
  width: number
  height: number
}

export interface AboutChairmanContent extends ContentBase {
  label: string
  person: AboutPerson
  /** Biography paragraphs, as documented in the company profile. */
  biography: string[]
  /** Quote attributed to the chairman in the profile. */
  quote: string
}

/**
 * Chairman and management team. Populated from the company profile under
 * the owner's 2026-09-23 approval (item 10); before that this section was a
 * structural placeholder with no name or photo. The old rule still holds
 * for anyone the approval does not cover — never invent a person. `body`
 * stays the section's own framing copy, not a biography.
 */
export interface AboutLeadershipContent extends ContentBase {
  eyebrow: string
  heading: string
  body: string
  chairman?: AboutChairmanContent
  teamLabel?: string
  team?: AboutPerson[]
}

export interface AboutContent extends ContentBase {
  hero: AboutHeroContent
  overview: AboutOverviewContent
  location: AboutLocationContent
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
  /**
   * Public contact details. Each stays undefined until the company confirms
   * it is current and publishable — see docs/unresolved-content-approvals.md
   * item 6 for the approval state of each field.
   */
  address?: string
  /**
   * Human-readable display form, e.g. "+966 50 006 4807". The dialable
   * tel: target is derived from this at render time rather than stored a
   * second time, so the two can never disagree.
   */
  phone?: string
  email?: string
  /** Already-localized working hours line. */
  hours?: string
}

/**
 * Platforms the footer can link to. AppFooter.vue maps every member of
 * this union to a display name, so adding a platform here without naming
 * it there is a type error rather than a silently blank link.
 */
export type SocialPlatform = 'linkedin' | 'instagram' | 'x' | 'facebook' | 'tiktok' | 'youtube'

export interface SocialLink {
  platform: SocialPlatform
  /**
   * Absolute URL of the official company profile, exactly as supplied by
   * the company. Never derive one from a handle: per
   * docs/unresolved-content-approvals.md item 6 the profile's
   * "@Binzomah Cosmetics" has no identified platform.
   */
  url: string
}

export interface BrandLogo {
  /** Approved production asset — never a presentation-deck extraction. */
  src: `/logos/brands/${string}`
  width: number
  height: number
}

export interface BrandContent extends ContentBase {
  slug: string
  name: string
  introduction?: string
  relationship?: string
  logo?: BrandLogo
  officialUrl?: string
}

export interface PartnerLogo {
  /** Approved production asset — never a presentation-deck extraction. */
  src: `/logos/partners/${string}`
  width: number
  height: number
}
