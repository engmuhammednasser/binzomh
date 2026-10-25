import type { InjectionKey } from 'vue'
import { siteImageSlots } from '~~/content/images'
import { siteLogos } from '~~/content/logos'
import type { ManagedLogo, MediaItem } from '~~/types/cms'
import { validateImageFile } from '../../utils/image-validation'
import { libraryImages } from '../../utils/media-library'
import { usageKey, useAdminUpload, type ReplacementError } from './useAdminImages'

/**
 * The media library and the logos. Uploads persist on the server as soon as
 * they are made; using one anywhere — a page slot, a gallery, a logo — is a
 * draft edit like any other, visible to visitors only once published.
 */
export function useAdminMedia() {
  const uploads = useState<MediaItem[] | null>('cms-media', () => null)
  const failed = useState('cms-media-failed', () => false)
  const { draft, state: baseline } = useAdminWorkspace()
  const { base } = useAdminSession()
  const request = useRequestFetch()
  const upload = useAdminUpload()
  const { t, locale } = useI18n()

  async function loadUploads() {
    try {
      uploads.value = await request<MediaItem[]>(`${base}/api/admin/media`)
      failed.value = false
    }
    catch {
      failed.value = true
    }
  }
  const library = computed(() => libraryImages(uploads.value ?? []))

  // Where each file appears in the draft, for "used in" labels.
  const usage = computed(() => {
    const places = new Map<string, string[]>()
    const add = (src: string, label: string) => places.set(src, [...(places.get(src) ?? []), label])
    for (const slot of Object.values(siteImageSlots)) {
      const image = draft.value!.slots[slot.id]
      if (image) add(image.src, t(usageKey(slot.section)))
    }
    for (const [page, items] of Object.entries(draft.value!.galleries)) {
      for (const item of items) add(item.src, t('admin.media.inGallery', { page: t(`admin.pages.${page}`) }))
    }
    for (const logo of siteLogos) add((draft.value!.logos[logo.id] ?? logo.file).src, t('admin.media.logoOf', { name: logo.name || t('admin.team.unnamed') }))
    return places
  })
  /** "Home — hero, About — gallery", or empty when the draft does not use the file. */
  const usedIn = (src: string) => usage.value.get(src)?.join(locale.value === 'ar' ? '، ' : ', ') ?? ''

  async function addToLibrary(files: File[]) {
    const refused: { name: string, error: ReplacementError }[] = []
    for (const file of files) {
      const invalid = validateImageFile(file)
      if (invalid || !await upload(file)) refused.push({ name: file.name, error: invalid || 'read' })
    }
    await loadUploads()
    return refused
  }

  const logos = computed(() => siteLogos.map((logo) => {
    const current = draft.value!.logos[logo.id] ?? logo.file
    const saved = baseline.value!.draft.logos[logo.id] ?? logo.file
    return { ...logo, current, replaced: current.src !== logo.id, edited: current.src !== saved.src }
  }))
  function setLogo(id: string, image: { src: string, width: number, height: number }) {
    draft.value!.logos[id] = { src: image.src as ManagedLogo['src'], width: image.width, height: image.height }
  }
  async function uploadLogo(id: string, file: File): Promise<ReplacementError | null> {
    const invalid = validateImageFile(file)
    if (invalid) return invalid
    const image = await upload(file)
    if (!image) return 'read'
    setLogo(id, image)
    await loadUploads()
    return null
  }
  /** Back to the approved file. */
  function restoreLogo(id: string) {
    const original = siteLogos.find(logo => logo.id === id)
    if (original) setLogo(id, original.file)
  }
  /** Back to the last saved draft. */
  function discardLogo(id: string) {
    const saved = baseline.value!.draft.logos[id]
    if (saved) setLogo(id, saved)
  }

  const state = { uploads, failed, library, usedIn, logos, loadUploads, addToLibrary, setLogo, uploadLogo, restoreLogo, discardLogo }
  provide(ADMIN_MEDIA_KEY, state)
  return state
}
type AdminMediaState = ReturnType<typeof useAdminMedia>
const ADMIN_MEDIA_KEY: InjectionKey<AdminMediaState> = Symbol('admin-media')
export function useAdminMediaContext() {
  const state = inject(ADMIN_MEDIA_KEY)
  if (!state) throw new Error('Media library context missing')
  return state
}
