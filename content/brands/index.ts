import type { BrandContent } from '~~/types/content'
import type { BrandProfile } from '~~/types/brands'
import { embryolisseBrand } from './embryolisse.ts'
import { zoaBrand } from './zoa.ts'
import { rvbLabBrand } from './rvb-lab.ts'

// One design roster drives listing, detail routes, sitemap, and the N02 teaser.
export const brandProfiles: BrandProfile[] = [embryolisseBrand, zoaBrand, rvbLabBrand]

export function findBrand(slug: string) {
  return brandProfiles.find(brand => brand.slug === slug)
}

// Preserve the homepage's existing contract without exposing optional claims.
export const homeBrandCandidates: BrandContent[] = brandProfiles.map(({ slug, name, status, logo }) => ({ slug, name, status, logo }))
