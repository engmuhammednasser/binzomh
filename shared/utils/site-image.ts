import type { SiteImageFile, SiteImageFormat } from '../../types/images'
import { assetUrl } from './asset-url.ts'

/**
 * The order a <picture> offers an image's encodings in: WebP is the main
 * format, then AVIF, then the original PNG/JPEG as the <img> fallback.
 * A browser takes the first type it supports.
 */
export const SITE_IMAGE_FORMATS = ['webp', 'avif'] as const satisfies readonly SiteImageFormat[]

const MIME: Record<SiteImageFormat, `image/${SiteImageFormat}`> = { webp: 'image/webp', avif: 'image/avif' }

type ImageEncodings = Pick<SiteImageFile, 'src' | 'width' | 'variants'> & { formats?: SiteImageFormat[] }

/** Path of the full-size copy in `format`: `<stem>.<format>` beside the original. */
export function imageFormatPath(image: Pick<SiteImageFile, 'src'>, format: SiteImageFormat) {
  const stem = image.src.replace(/\.[a-z0-9]+$/i, '')
  return `${stem}.${format}` as `/images/${string}`
}

/**
 * Path of one responsive derivative: `<stem>-<width>.<format>` beside the
 * original (see SiteImageFile.variants).
 */
export function imageVariantPath(image: Pick<SiteImageFile, 'src'>, width: number, format: SiteImageFormat) {
  const stem = image.src.replace(/\.[a-z0-9]+$/i, '')
  return `${stem}-${width}.${format}` as `/images/${string}`
}

/**
 * The srcset for one format, every path under the app's base URL: the
 * smaller derivatives, then the full-size copy at the image's own width.
 * Undefined when the image has no file in that format.
 */
export function imageSrcset(baseURL: string, image: ImageEncodings, format: SiteImageFormat) {
  const candidates: string[] = []
  if (image.variants?.formats.includes(format)) {
    for (const width of image.variants.widths) {
      if (width < image.width) candidates.push(`${assetUrl(baseURL, imageVariantPath(image, width, format))} ${width}w`)
    }
  }
  if (image.formats?.includes(format)) candidates.push(`${assetUrl(baseURL, imageFormatPath(image, format))} ${image.width}w`)
  return candidates.length ? candidates.join(', ') : undefined
}

/**
 * The <source> list for a <picture>, in SITE_IMAGE_FORMATS order, leaving
 * out any format the image has no file for.
 */
export function imageSources(baseURL: string, image: ImageEncodings) {
  return SITE_IMAGE_FORMATS.flatMap((format) => {
    const srcset = imageSrcset(baseURL, image, format)
    return srcset ? [{ type: MIME[format], srcset }] : []
  })
}

/** CSS aspect-ratio for a frame, e.g. "1672 / 941". */
export const frameAspect = (frame: { width: number, height: number }) => `${frame.width} / ${frame.height}`
