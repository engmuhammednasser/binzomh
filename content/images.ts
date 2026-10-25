import type { GalleryImage, SiteImageFile, SiteImagePage, SiteImageSlot } from '~~/types/images'

/**
 * Every page image on the site, in one place.
 *
 * Two kinds:
 *
 * - **Slots** (`siteImageSlots`): the fixed places the design shows an
 *   image — a hero, an overview visual. Each slot is its own entry, even
 *   where two currently show the same file (the first capabilities photo
 *   fills three slots), so replacing one changes that place only. A slot
 *   whose `image` is null shows the design placeholder (EditorialVisual)
 *   in the same frame.
 * - **Galleries** (`pageGalleries`): a free list per page, rendered by
 *   BaseGallery near the end of the page and only when it has pictures.
 *
 * What stays in the components is layout: each <img>'s `sizes`, loading
 * priority and classes depend on where it sits, not on which file fills it.
 *
 * Formats: every file is served as WebP first, from a full-size copy beside
 * it (hero.png → hero.webp, listed in `formats`), plus any smaller
 * `variants`; the original PNG/JPEG stays as the <img> fallback. A new
 * file needs its WebP copy before it goes here.
 *
 * People's portraits are not here: they belong to the person they show
 * and live with the rest of that record in content/{en,ar}/about.ts.
 * Logos are approved brand assets (content/brands, content/*\/network.ts).
 *
 * Approval: every file below is already published and approved — see
 * docs/unresolved-content-approvals.md item 3. A new file, in a slot or a
 * gallery, must clear the same approval before it goes here.
 */

// The published files, named once so the slots that start on the same
// photo share its details without being linked to each other.
const files = {
  homeHero: { src: '/images/home/hero.png', width: 1672, height: 941, formats: ['webp'], variants: { widths: [960, 1440], formats: ['avif', 'webp'] }, alt: 'site-name' },
  homeAbout: { src: '/images/home/about.png', width: 1122, height: 1402, formats: ['webp'], variants: { widths: [480, 960], formats: ['avif', 'webp'] }, alt: 'decorative' },
  capabilities1: { src: '/images/home/capabilities-1.png', width: 1122, height: 1402, formats: ['webp'], variants: { widths: [480, 960], formats: ['avif', 'webp'] }, alt: 'decorative' },
  capabilities2: { src: '/images/home/capabilities-2.png', width: 1122, height: 1402, formats: ['webp'], variants: { widths: [480, 960], formats: ['avif', 'webp'] }, alt: 'decorative' },
  capabilities3: { src: '/images/home/capabilities-3.png', width: 1122, height: 1402, formats: ['webp'], variants: { widths: [480, 960], formats: ['avif', 'webp'] }, alt: 'decorative' },
  aboutHero: { src: '/images/about/hero.jpeg', width: 1448, height: 1086, formats: ['webp'], variants: { widths: [480, 960], formats: ['webp'] }, alt: 'decorative' },
  aboutOverview: { src: '/images/about/overview.jpeg', width: 1086, height: 1448, formats: ['webp'], variants: { widths: [480, 960], formats: ['webp'] }, alt: 'decorative' },
  aboutLocation: { src: '/images/about/location.jpeg', width: 1536, height: 1024, formats: ['webp'], variants: { widths: [480, 960], formats: ['webp'] }, alt: 'decorative' },
  brandsHero: { src: '/images/brands/hero.jpeg', width: 1672, height: 941, formats: ['webp'], alt: 'decorative' },
} as const satisfies Record<string, SiteImageFile>

const slot = (id: string, page: SiteImagePage, section: string, image: SiteImageFile): SiteImageSlot =>
  // A copy per slot: two slots starting on the same file share nothing.
  ({ id, page, section, frame: { width: image.width, height: image.height }, image: structuredClone(image) })

export const siteImageSlots = {
  'home-hero': slot('home-hero', 'home', 'home.hero', files.homeHero),
  'home-about': slot('home-about', 'home', 'home.about', files.homeAbout),
  'home-capabilities-1': slot('home-capabilities-1', 'home', 'home.capabilities1', files.capabilities1),
  'home-capabilities-2': slot('home-capabilities-2', 'home', 'home.capabilities2', files.capabilities2),
  'home-capabilities-3': slot('home-capabilities-3', 'home', 'home.capabilities3', files.capabilities3),
  // Marketing & Branding has no approved photo yet: the placeholder fills
  // the same 4:5 frame as its neighbours until one is chosen in the dashboard.
  'home-capabilities-4': { id: 'home-capabilities-4', page: 'home', section: 'home.capabilities4', frame: { width: 1122, height: 1402 }, image: null },
  'capabilities-hero': slot('capabilities-hero', 'capabilities', 'capabilities.hero', files.capabilities1),
  'capabilities-section-1': slot('capabilities-section-1', 'capabilities', 'capabilities.section1', files.capabilities1),
  'capabilities-section-2': slot('capabilities-section-2', 'capabilities', 'capabilities.section2', files.capabilities2),
  'capabilities-section-3': slot('capabilities-section-3', 'capabilities', 'capabilities.section3', files.capabilities3),
  // Marketing & Branding, as on the homepage: the placeholder until a photo
  // is chosen in the dashboard.
  'capabilities-section-4': { id: 'capabilities-section-4', page: 'capabilities', section: 'capabilities.section4', frame: { width: 1122, height: 1402 }, image: null },
  'about-hero': slot('about-hero', 'about', 'about.hero', files.aboutHero),
  'about-overview': slot('about-overview', 'about', 'about.overview', files.aboutOverview),
  'about-location': slot('about-location', 'about', 'about.location', files.aboutLocation),
  'brands-hero': slot('brands-hero', 'brands', 'brands.hero', files.brandsHero),
} satisfies Record<string, SiteImageSlot>

export type SiteImageSlotId = keyof typeof siteImageSlots

/** Missing/unrecognised slots use the component's placeholder. */
export function getSiteImageSlot(id?: string): SiteImageSlot | undefined {
  return id && Object.hasOwn(siteImageSlots, id) ? siteImageSlots[id as SiteImageSlotId] : undefined
}

/** Free-form galleries, one per page. Empty means the page shows none. */
export const pageGalleries: Record<SiteImagePage, GalleryImage[]> = {
  home: [],
  about: [],
  capabilities: [],
  brands: [],
  network: [],
  contact: [],
}
