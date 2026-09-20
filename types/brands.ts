import type { ContentBase, ContentStatus, CtaLink, LocaleCode } from './content'

/** Approval belongs to this field, not to the roster entry or its neighbours. */
export interface BrandField<T> {
  status: ContentStatus
  content?: Partial<Record<LocaleCode, T>>
}

export interface BrandImage {
  /** Approved local artwork only; presentation-deck extracts are not assets. */
  src: `/images/brands/${string}`
  alt: string
  width: number
  height: number
}

export interface BrandRange {
  name: string
  description?: string
}

export interface BrandProfile extends ContentBase {
  slug: string
  /** The design-approved name is shared across locales; it is not a logo. */
  name: string
  introduction?: BrandField<string>
  relationship?: BrandField<string>
  image?: BrandField<BrandImage>
  ranges?: BrandField<BrandRange[]>
}

export interface BrandsPageContent extends ContentBase {
  title: string
  description: string
  eyebrow: string
  intro: string
  rosterNotice: string
  viewBrand: string
  enquiryHeading: string
  enquiryBody: string
  enquiryCta: CtaLink
  detail: {
    back: string
    eyebrow: string
    description: string
    introductionHeading: string
    missingIntroduction: string
    relationshipHeading: string
    missingRelationship: string
    imageLabel: string
    missingImage: string
    rangesHeading: string
    enquiryHeading: string
    enquiryBody: string
    enquiryLabel: string
  }
}
