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
import { socialLinks } from '../../content/social'
import { collectCopy } from '../../shared/utils/cms-copy'
import { SOCIAL_PLATFORMS } from '../../layers/admin/utils/contact-validation'
import type { Workspace } from '../../types/cms'

export const pagePairs = { home: [homeEn, homeAr], about: [aboutEn, aboutAr], brands: [brandsEn, brandsAr], capabilities: [capabilitiesEn, capabilitiesAr], network: [networkEn, networkAr], contact: [contactEn, contactAr] } as const
export function seedWorkspace(): Workspace {
  return JSON.parse(JSON.stringify({
    copy: Object.fromEntries(Object.entries(pagePairs).map(([key, [en, ar]]) => [key, collectCopy(en, ar)])),
    brands: brandProfiles,
    social: Object.fromEntries(SOCIAL_PLATFORMS.map(platform => [platform, socialLinks.find(link => link.platform === platform)?.url ?? ''])),
    slots: Object.fromEntries(Object.values(siteImageSlots).map(slot => [slot.id, slot.image])),
    galleries: Object.fromEntries(Object.keys(pagePairs).map(key => [key, []])),
  }))
}

/** Approval metadata and unapproved brand copy are never included in the public API. */
export function publicWorkspace(draft: Workspace): Workspace {
  const data: Workspace = JSON.parse(JSON.stringify(draft))
  data.brands = data.brands.map((brand) => {
    delete brand.note
    for (const field of ['introduction', 'relationship', 'image', 'ranges'] as const) {
      if (brand[field]?.status !== 'approved') Reflect.deleteProperty(brand, field)
    }
    return brand
  })
  return data
}
