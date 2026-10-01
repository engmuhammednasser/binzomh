/**
 * Page imagery — see content/images.ts for the registry and why it lives
 * there rather than in each component.
 */
/**
 * Modern encodings an image can be served in. WebP is the main format; the
 * order the page offers them in is SITE_IMAGE_FORMATS
 * (shared/utils/site-image.ts), and the original PNG/JPEG is the fallback.
 */
export type SiteImageFormat = 'webp' | 'avif'

export type SiteImagePage = 'home' | 'about' | 'capabilities' | 'brands' | 'network' | 'contact'

/**
 * How an image is described to assistive tech:
 * - 'decorative': alt="" (the image carries no information the text
 *   beside it does not already give);
 * - 'site-name': the localized site name from app.config — kept as a
 *   reference, not a copy, so the two can never drift;
 * - { en, ar }: a written description per locale.
 */
export type SiteImageAlt = 'decorative' | 'site-name' | { en: string, ar: string }

/** One image file and how it is delivered. */
export interface SiteImageFile {
  /** The full-size original, and the <img> fallback. Root-relative under public/. */
  src: `/images/${string}`
  width: number
  height: number
  /**
   * Full-size copies of the original, at its own width and height, beside
   * `src` under the same name (hero.png → hero.webp). Every page image has
   * at least 'webp'.
   */
  formats: SiteImageFormat[]
  /**
   * Smaller responsive copies, when they exist: for each format and width a
   * file named `<stem>-<width>.<format>` beside `src` (hero.png →
   * hero-960.avif). The browser picks from these and the full-size copy.
   */
  variants?: { widths: number[], formats: SiteImageFormat[] }
  alt: SiteImageAlt
}

/**
 * One place on one page that shows an image. Every slot is independent:
 * two slots may start out on the same file, but replacing one never
 * changes the other.
 */
export interface SiteImageSlot {
  id: string
  page: SiteImagePage
  /** "page.section" key for the dashboard's label. */
  section: string
  /**
   * The frame's proportions, kept apart from the file: the layout is
   * built around them, and with no image the default placeholder fills a
   * frame of exactly this shape.
   */
  frame: { width: number, height: number }
  /** null: no image chosen — the page shows its design placeholder. */
  image: SiteImageFile | null
}

/** One picture in a page's free-form gallery. */
export interface GalleryImage {
  id: string
  src: `/images/${string}`
  width: number
  height: number
  /** Full-size copies beside `src`, as for SiteImageFile.formats. */
  formats?: SiteImageFormat[]
  /** Gallery pictures stand alone, with no text beside them, so they always carry a description. */
  alt: { en: string, ar: string }
}
