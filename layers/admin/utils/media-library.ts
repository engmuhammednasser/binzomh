import { siteImageSlots } from '~~/content/images'
import { siteLogos } from '~~/content/logos'
import type { MediaItem } from '~~/types/cms'
import type { SiteImageFile } from '~~/types/images'
import { imageFormatPath, imageVariantPath } from '~~/shared/utils/site-image'

/**
 * What the media library holds: the owner's uploads, the site's approved
 * photos and the approved logo files. Choosing one only records its path;
 * the server resolves every detail of it again (server/cms/validate.ts).
 */
export type LibraryKind = 'upload' | 'photo' | 'logo'
export const LIBRARY_KINDS: readonly LibraryKind[] = ['upload', 'photo', 'logo']

export interface LibraryImage {
  src: string
  width: number
  height: number
  kind: LibraryKind
  /** The file to show in a grid: the smallest copy the site already serves. */
  thumb: string
  /** Uploads only: the stored, optimized size. */
  bytes?: number
}

// Several slots start on the same photo: one entry per file.
export const sitePhotos: SiteImageFile[] = [...new Map(Object.values(siteImageSlots)
  .flatMap(slot => slot.image ? [[slot.image.src, slot.image] as const] : [])).values()]

function photoThumb(image: SiteImageFile) {
  if (image.variants?.formats.includes('webp')) return imageVariantPath(image, Math.min(...image.variants.widths), 'webp')
  return image.formats.includes('webp') ? imageFormatPath(image, 'webp') : image.src
}

export function libraryImages(uploads: MediaItem[]): LibraryImage[] {
  return [
    ...uploads.map(item => ({ ...item, kind: 'upload' as const, thumb: item.src })),
    ...sitePhotos.map(image => ({ src: image.src, width: image.width, height: image.height, kind: 'photo' as const, thumb: photoThumb(image) })),
    ...siteLogos.map(logo => ({ ...logo.file, kind: 'logo' as const, thumb: logo.file.src })),
  ]
}

/** A page-image slot's value for a library image, as the server will store it. */
export function slotFileFor(image: LibraryImage): SiteImageFile {
  const photo = sitePhotos.find(entry => entry.src === image.src)
  if (photo) return structuredClone(photo)
  return { src: image.src as SiteImageFile['src'], width: image.width, height: image.height, formats: ['webp'], alt: 'decorative' }
}
