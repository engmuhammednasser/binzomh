import type { BrandContent } from '~~/types/content'
import { embryolisseBrand } from './embryolisse'
import { zoaBrand } from './zoa'
import { rvbLabBrand } from './rvb-lab'

// Single source of truth for the N02 working brand roster, consumed by the
// homepage brand-portfolio section. Production Brand Detail pages are out
// of scope for N02 (brands/[slug].vue still renders its generic
// placeholder for every slug) — this list only feeds the teaser.
export const homeBrandCandidates: BrandContent[] = [embryolisseBrand, zoaBrand, rvbLabBrand]
