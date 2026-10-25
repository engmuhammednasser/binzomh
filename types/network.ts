import type { ChannelIcon, ContentStatus, CtaLink, NetworkContent, PartnerLogo } from './content'

export type NetworkChannelId = 'pharmacies' | 'e-commerce' | 'hospitals' | 'wholesale' | 'cosmetics-stores'

export interface NetworkChannel {
  id: NetworkChannelId
  name: string
  description: string
  icon: ChannelIcon
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
    /**
     * Display only entries explicitly cleared for public use. No implied
     * endorsement beyond reproducing the company profile's own listing.
     *
     * `name` is omitted for a mark the company profile shows but does
     * not identify — the artwork is real and approved, the company behind
     * it is simply unconfirmed. Such an entry must carry a `logo`, since
     * there is nothing else to render, and it is shown decoratively rather
     * than captioned with a name nobody has verified.
     *
     * `channel` is the row the entry appears in, as on the profile's
     * channel slides. The dashboard edits names by array index, so group
     * at render time rather than reordering this list.
     */
    names: { name?: string, status: ContentStatus, channel: NetworkChannelId, logo?: PartnerLogo }[]
  }
  enquiry: { heading: string, body: string, cta: CtaLink }
}
