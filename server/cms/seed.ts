import { homeContent as homeEn } from '../../content/en/home'
import { homeContent as homeAr } from '../../content/ar/home'
import { aboutContent as aboutEn } from '../../content/en/about'
import { aboutContent as aboutAr } from '../../content/ar/about'
import { brandsContent as brandsEn } from '../../content/en/brands'
import { brandsContent as brandsAr } from '../../content/ar/brands'
import { capabilitiesContent as capabilitiesEn } from '../../content/en/capabilities'
import { capabilitiesContent as capabilitiesAr } from '../../content/ar/capabilities'
import { networkContent as networkEn } from '../../content/en/network'
import { networkContent as networkAr } from '../../content/ar/network'
import { contactContent as contactEn } from '../../content/en/contact'
import { contactContent as contactAr } from '../../content/ar/contact'
import { brandProfiles } from '../../content/brands'
import { siteImageSlots } from '../../content/images'
import { siteLogos } from '../../content/logos'
import { socialLinks } from '../../content/social'
import { collectCopy } from '../../shared/utils/cms-copy'
import { SOCIAL_PLATFORMS } from '#shared/utils/contact-validation'
import type { Workspace } from '../../types/cms'

export const pagePairs = { home: [homeEn, homeAr], about: [aboutEn, aboutAr], brands: [brandsEn, brandsAr], capabilities: [capabilitiesEn, capabilitiesAr], network: [networkEn, networkAr], contact: [contactEn, contactAr] } as const
export function seedWorkspace(): Workspace {
  return JSON.parse(JSON.stringify({
    copy: Object.fromEntries(Object.entries(pagePairs).map(([key, [en, ar]]) => [key, collectCopy(en, ar)])),
    brands: brandProfiles,
    social: Object.fromEntries(SOCIAL_PLATFORMS.map(platform => [platform, socialLinks.find(link => link.platform === platform)?.url ?? ''])),
    slots: Object.fromEntries(Object.values(siteImageSlots).map(slot => [slot.id, slot.image])),
    galleries: Object.fromEntries(Object.keys(pagePairs).map(key => [key, []])),
    logos: Object.fromEntries(siteLogos.map(logo => [logo.id, logo.file])),
  }))
}

/**
 * Drafts, publications and revisions saved before a page field, an image
 * slot or editable logos existed read with the seed's value for it. Copy
 * rows are rebuilt in the seed's order, since saving expects exactly that
 * list, keeping every saved value whose path still exists.
 *
 * Brands keep only what the dashboard edits (name, introduction,
 * relationship — as validateWorkspace does on save); everything else,
 * such as the logo file, always reads from the code, so a stored copy
 * never pins a file the code has since replaced.
 */
export function normalizeWorkspace(workspace: Workspace): Workspace {
  const seed = seedWorkspace()
  const copy = Object.fromEntries(Object.entries(seed.copy).map(([page, rows]) => {
    const saved = new Map((workspace.copy?.[page as keyof Workspace['copy']] ?? []).map(row => [row.path, row]))
    return [page, rows.map(row => saved.get(row.path) ?? row)]
  })) as Workspace['copy']
  const savedBrands = new Map((workspace.brands ?? []).map(brand => [brand.slug, brand]))
  const brands = seed.brands.map((brand) => {
    const saved = savedBrands.get(brand.slug)
    if (!saved) return brand
    return {
      ...brand,
      name: saved.name,
      ...(saved.introduction && { introduction: saved.introduction }),
      ...(saved.relationship && { relationship: saved.relationship }),
    }
  })
  return { ...workspace, copy, brands, slots: { ...seed.slots, ...workspace.slots }, logos: { ...seed.logos, ...workspace.logos } }
}

/** Approval metadata and unapproved brand copy are never included in the public API. */
export function publicWorkspace(draft: Workspace): Workspace {
  const data: Workspace = normalizeWorkspace(JSON.parse(JSON.stringify(draft)))
  data.brands = data.brands.map((brand) => {
    delete brand.note
    for (const field of ['introduction', 'relationship', 'image', 'ranges'] as const) {
      if (brand[field]?.status !== 'approved') Reflect.deleteProperty(brand, field)
    }
    return brand
  })
  return data
}
