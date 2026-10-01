import type { GalleryImage, SiteImageFile } from '~~/types/images'
import { imageSources } from '~~/shared/utils/site-image'

/**
 * Render helpers for a content/images.ts file: the base-path-aware src
 * and <picture> sources (dynamic bindings bypass Nuxt's build-time
 * prefixing, see shared/utils/asset-url.ts) and the locale's alt text.
 */
export function useSiteImage() {
  const { app } = useRuntimeConfig()
  const { locale } = useI18n()
  const siteName = useSiteName()
  const assetUrl = useAssetUrl()

  return {
    src: (image: Pick<SiteImageFile, 'src'>) => assetUrl(image.src),
    /** One <source> per encoding the image exists in, WebP first; the <img> keeps the original. */
    sources: (image: SiteImageFile | GalleryImage) => imageSources(app.baseURL, image),
    alt: (image: Pick<SiteImageFile, 'alt'>) => {
      if (image.alt === 'decorative') return ''
      if (image.alt === 'site-name') return siteName.value
      return locale.value === 'ar' ? image.alt.ar : image.alt.en
    },
  }
}
