/**
 * Checks for a replacement image in the dashboard's image library.
 * Unit-tested in tests/admin-image-validation.test.mjs, and written to be
 * reused unchanged by the upload endpoint once saving exists — which must
 * re-check the file itself (type by content, not by name), since anything
 * the browser reports can be forged.
 */

/**
 * Raster formats the site can serve and re-encode. SVG is deliberately
 * absent: an uploaded SVG is a document that can carry script, and these
 * slots only ever hold photographs and supplied brand visuals.
 */
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024

export type ImageFileError = 'type' | 'size'

export function validateImageFile(file: { type: string, size: number }): ImageFileError | null {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) return 'type'
  if (file.size > MAX_IMAGE_BYTES) return 'size'
  return null
}

export interface ImageFit {
  /** Narrower than the largest width the site serves for this slot: it would be upscaled and look soft. */
  tooSmall: boolean
  /** The width the replacement must reach to avoid upscaling. */
  minWidth: number
  /** Aspect ratio differs from the slot's by more than 2%: the frame will crop it. */
  cropped: boolean
}

/**
 * How a replacement of `natural` pixels fits a slot of `slot` pixels whose
 * largest served derivative is `largestVariant` wide (0 when the original
 * ships alone, in which case the original's own width is the bar).
 */
export function assessImageFit(
  natural: { width: number, height: number },
  slot: { width: number, height: number },
  largestVariant = 0,
): ImageFit {
  const minWidth = largestVariant || slot.width
  const ratio = natural.width / natural.height
  const slotRatio = slot.width / slot.height
  return {
    tooSmall: natural.width < minWidth,
    minWidth,
    cropped: Math.abs(ratio - slotRatio) / slotRatio > 0.02,
  }
}

/** "16:9", "4:5", "3:2" — or the ratio to two places when it is not a common one. */
export function describeRatio(width: number, height: number) {
  const common: [number, number][] = [[16, 9], [4, 3], [3, 2], [1, 1], [4, 5], [3, 4], [2, 3], [9, 16]]
  const ratio = width / height
  const match = common.find(([w, h]) => Math.abs(ratio - w / h) / (w / h) < 0.02)
  return match ? `${match[0]}:${match[1]}` : `${ratio.toFixed(2)}:1`
}
