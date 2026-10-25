import type { ManagedLogo } from '~~/types/cms'
import { brandProfiles, logoOnlyBrands } from './brands/index.ts'
import { homeContent } from './en/home.ts'
import { networkContent } from './en/network.ts'

/**
 * Every brand and partner logo the site shows, keyed by its approved file.
 *
 * The key never changes: the dashboard stores a replacement under it, and
 * every place that shows the logo — brand cards, the home marquee, the
 * network wall — resolves through the same key (shared/utils/cms-logos.ts),
 * so one replacement updates them all. Restoring puts the approved file back.
 *
 * The roster itself stays in content/brands and content/{en,ar}/network.ts;
 * this list only adds the ability to change each entry's artwork.
 */
export interface SiteLogo {
  id: `/logos/${string}`
  group: 'brand' | 'partner'
  /** Shared across locales; empty for the unnamed marks. */
  name: string
  file: ManagedLogo
}

const entries: SiteLogo[] = [
  ...brandProfiles.flatMap(brand => brand.logo ? [{ id: brand.logo.src as SiteLogo['id'], group: 'brand' as const, name: brand.name, file: { ...brand.logo } }] : []),
  ...logoOnlyBrands.map(brand => ({ id: brand.logo.src as SiteLogo['id'], group: 'brand' as const, name: brand.name, file: { ...brand.logo } })),
  ...[...networkContent.partners.names, ...(homeContent.network.logos ?? [])]
    .flatMap(partner => partner.logo ? [{ id: partner.logo.src as SiteLogo['id'], group: 'partner' as const, name: partner.name ?? '', file: { ...partner.logo } }] : []),
]

// The home marquee repeats partners from the network wall: one entry each.
export const siteLogos: SiteLogo[] = entries.filter((entry, index) => entries.findIndex(other => other.id === entry.id) === index)
