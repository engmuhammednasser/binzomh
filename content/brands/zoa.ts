import type { BrandProfile } from '~~/types/brands'

// Logo approved 2026-09-22 (docs/unresolved-content-approvals.md item 1);
// introduction, relationship, image and official link remain unapproved.
export const zoaBrand: BrandProfile = {
  status: 'draft',
  slug: 'zoa',
  name: 'Zoā',
  logo: { src: '/logos/brands/zoa.png', width: 1365, height: 667 },
  note: 'Working design roster per the 2026-09-20 project decision (docs/unresolved-content-approvals.md item 2). No exclusivity implied.',
}
