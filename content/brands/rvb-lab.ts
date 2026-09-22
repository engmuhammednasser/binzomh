import type { BrandProfile } from '~~/types/brands'

// Logo approved 2026-09-22 (docs/unresolved-content-approvals.md item 1);
// introduction, relationship, image and official link remain unapproved.
export const rvbLabBrand: BrandProfile = {
  status: 'draft',
  slug: 'rvb-lab',
  name: 'RVB LAB',
  logo: { src: '/logos/brands/rvb-lab.png', width: 225, height: 225 },
  note: 'Working design roster per the 2026-09-20 project decision (docs/unresolved-content-approvals.md item 2). No exclusivity implied.',
}
