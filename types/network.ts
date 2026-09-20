import type { ContentStatus, CtaLink, NetworkContent } from './content'

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
    /** Display only names explicitly cleared for public use. No implied endorsements. */
    names: { name: string, status: ContentStatus }[]
  }
  enquiry: { heading: string, body: string, cta: CtaLink }
}
