import type { BrandProfile } from '~~/types/brands'

// Draft N02 design entry — see content/brands/README.md. Logo approved
// 2026-09-22 and replaced 2026-10-15 with the official SVG wordmark
// (docs/unresolved-content-approvals.md item 1); introduction,
// relationship, image and official link remain unapproved.
export const embryolisseBrand: BrandProfile = {
  status: 'draft',
  slug: 'embryolisse',
  name: 'Embryolisse',
  // The SVG has no width/height of its own: these are its viewBox
  // (1226.9 x 702.5), rounded, so the <img> reserves the right shape.
  logo: { src: '/logos/brands/embryolisse.svg', width: 1227, height: 703 },
  note: 'Working design roster per the 2026-09-20 project decision (docs/unresolved-content-approvals.md item 2). No exclusivity implied.',
}
