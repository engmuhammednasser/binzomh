import type { BrandContent } from '~~/types/content'
import type { BrandProfile, LogoOnlyBrand } from '~~/types/brands'
import { embryolisseBrand } from './embryolisse.ts'
import { zoaBrand } from './zoa.ts'
import { rvbLabBrand } from './rvb-lab.ts'

// One design roster drives listing, detail routes, sitemap, and the N02 teaser.
export const brandProfiles: BrandProfile[] = [embryolisseBrand, zoaBrand, rvbLabBrand]

// Shown by logo under the roster on the homepage and /brands, at the team's
// request (2026-10-15, docs/unresolved-content-approvals.md item 1). Not
// roster entries: no profile page, so they render as images, not links.
export const logoOnlyBrands: LogoOnlyBrand[] = [
  { name: 'Ecowell', logo: { src: '/logos/brands/ecowell.png', width: 1000, height: 454 } },
  { name: 'Forté Pharma', logo: { src: '/logos/brands/forte-pharma.png', width: 1200, height: 628 } },
]

export function findBrand(slug: string) {
  return brandProfiles.find(brand => brand.slug === slug)
}

// Preserve the homepage's existing contract without exposing optional claims.
export const homeBrandCandidates: BrandContent[] = brandProfiles.map(({ slug, name, status, logo }) => ({ slug, name, status, logo }))
