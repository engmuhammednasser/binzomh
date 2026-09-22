import type { BrandProfile } from '~~/types/brands'

// Draft N02 design entry — see content/brands/README.md. Logo approved
// 2026-09-22 (docs/unresolved-content-approvals.md item 1); introduction,
// relationship, image and official link remain unapproved.
export const embryolisseBrand: BrandProfile = {
  status: 'draft',
  slug: 'embryolisse',
  name: 'Embryolisse',
  logo: { src: '/logos/brands/embryolisse.png', width: 630, height: 630 },
  note: 'Working design roster per the 2026-09-20 project decision (docs/unresolved-content-approvals.md item 2). No exclusivity implied.',
}
