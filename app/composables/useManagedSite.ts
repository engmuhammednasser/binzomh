import type { Workspace } from '~~/types/cms'
import { brandProfiles } from '~~/content/brands'
import { socialLinks } from '~~/content/social'
import { getSiteImageSlot, pageGalleries } from '~~/content/images'
import type { SiteImagePage, SiteImageFormat } from '~~/types/images'
import type { SocialPlatform } from '~~/types/content'

export function useManagedSite() {
  const data = useState<Workspace | null>('managed-content', () => null)
  const brands = computed(() => data.value?.brands ?? brandProfiles)
  const social = computed(() => data.value
    ? Object.entries(data.value.social).filter(([, url]) => url).map(([platform, url]) => ({ platform: platform as SocialPlatform, url }))
    : socialLinks)
  const slotFor = (id?: string) => {
    const slot = getSiteImageSlot(id)
    return slot && data.value ? { ...slot, image: data.value.slots[slot.id] ?? null } : slot
  }
  const galleryFor = (page: SiteImagePage) => data.value
    ? data.value.galleries[page].map(image => ({ id: image.key, src: image.src, width: image.width, height: image.height, formats: ['webp'] as SiteImageFormat[], alt: { en: image.altEn, ar: image.altAr } }))
    : pageGalleries[page]
  return { brands, social, slotFor, galleryFor }
}
