import type { ContentStatus, CtaLink, NetworkContent, PartnerLogo } from './content'

export interface NetworkChannel {
  id: string
  name: string
  description: string
}

export interface NetworkPageContent extends NetworkContent {
  description: string
  eyebrow: string
  channelsHeading: string
  channelsLabel: string
  channels: NetworkChannel[]
  reach: { heading: string, body: string, note: string }
  partners: {
    heading: string
    body: string
    pendingLabel: string
    pendingBody: string
    /** Shown under the logo grid only when at least one entry is approved. */
    note?: string
    /** Display only entries explicitly cleared for public use. No implied
     *  endorsement beyond reproducing the company profile's own listing. */
    names: { name: string, status: ContentStatus, logo?: PartnerLogo }[]
  }
  enquiry: { heading: string, body: string, cta: CtaLink }
}
