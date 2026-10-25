import type { InjectionKey } from 'vue'
import { siteImageSlots } from '~~/content/images'
import type { SiteImageFile, SiteImagePage, SiteImageSlot } from '~~/types/images'
import { assessImageFit, validateImageFile, type ImageFit, type ImageFileError } from '../../utils/image-validation'
import { slotFileFor, type LibraryImage } from '../../utils/media-library'

export interface LocalImage { url: string, fileName: string, bytes: number, width: number, height: number }
export interface PendingReplacement extends LocalImage { fit: ImageFit }
export type SlotEdit = { kind: 'replace', image: PendingReplacement } | { kind: 'remove' }
export type ReplacementError = ImageFileError | 'read'

/** Uploads one file to the media library; the server decodes, checks and re-encodes it. */
export function useAdminUpload() {
  const { error, uploads } = useAdminWorkspace()
  const { session, base } = useAdminSession()
  return async function upload(file: File) {
    uploads.value++
    try {
      return await $fetch<SiteImageFile>(`${base}/api/admin/media`, { method: 'POST', headers: { 'x-csrf-token': session.value?.csrf || '', 'content-type': file.type }, body: file })
    }
    catch (cause) {
      error.value = (cause as { data?: { statusMessage?: string } }).data?.statusMessage || 'Image upload failed'
      return null
    }
    finally { uploads.value-- }
  }
}

export function useAdminImages() {
  const { draft, state: baseline } = useAdminWorkspace()
  const upload = useAdminUpload()
  const assetUrl = useAssetUrl()
  const galleries = computed(() => draft.value!.galleries)
  const slotsFor = (page: SiteImagePage): SiteImageSlot[] => Object.values(siteImageSlots)
    .filter(slot => slot.page === page).map(slot => ({ ...slot, image: draft.value!.slots[slot.id] ?? null }))
  const slotEdits = computed(() => {
    const edits = new Map<string, SlotEdit>()
    for (const slot of Object.values(siteImageSlots)) {
      const image = draft.value!.slots[slot.id]
      if (JSON.stringify(image) === JSON.stringify(baseline.value!.draft.slots[slot.id])) continue
      edits.set(slot.id, image ? { kind: 'replace', image: { url: assetUrl(image.src), fileName: image.src.split('/').at(-1)!, bytes: 0, width: image.width, height: image.height, fit: assessImageFit(image, slot.frame, 0) } } : { kind: 'remove' })
    }
    return edits
  })
  function resetSlot(id: string) {
    draft.value!.slots[id] = JSON.parse(JSON.stringify(baseline.value!.draft.slots[id]))
  }
  function removeSlot(slot: SiteImageSlot) {
    draft.value!.slots[slot.id] = null
  }
  async function replaceSlot(slot: SiteImageSlot, file: File): Promise<ReplacementError | null> {
    const invalid = validateImageFile(file)
    if (invalid) return invalid
    const image = await upload(file)
    if (!image) return 'read'
    draft.value!.slots[slot.id] = image
    return null
  }
  function chooseForSlot(slot: SiteImageSlot, image: LibraryImage) {
    draft.value!.slots[slot.id] = slotFileFor(image)
  }
  async function addToGallery(page: SiteImagePage, files: File[]) {
    const refused: { name: string, error: ReplacementError }[] = []
    for (const file of files) {
      const invalid = validateImageFile(file)
      if (invalid || galleries.value[page].length >= 40) {
        refused.push({ name: file.name, error: invalid || 'read' })
        continue
      }
      const image = await upload(file)
      if (!image) {
        refused.push({ name: file.name, error: 'read' })
        continue
      }
      galleries.value[page].push({ key: image.src, src: image.src, width: image.width, height: image.height, altEn: '', altAr: '' })
    }
    return refused
  }
  // A picture appears once per gallery: its path is its key.
  function addFromLibrary(page: SiteImagePage, image: LibraryImage) {
    const list = galleries.value[page]
    if (list.length >= 40 || list.some(item => item.src === image.src)) return
    const { src, width, height } = slotFileFor(image)
    list.push({ key: src, src, width, height, altEn: '', altAr: '' })
  }
  function removeFromGallery(page: SiteImagePage, key: string) {
    const index = galleries.value[page].findIndex(item => item.key === key)
    if (index >= 0) galleries.value[page].splice(index, 1)
  }
  function moveInGallery(page: SiteImagePage, key: string, by: -1 | 1) {
    const list = galleries.value[page]
    const from = list.findIndex(item => item.key === key)
    const to = from + by
    if (from < 0 || to < 0 || to >= list.length) return
    const [item] = list.splice(from, 1)
    list.splice(to, 0, item!)
  }
  const changesFor = (page: SiteImagePage) => slotsFor(page).filter(slot => slotEdits.value.has(slot.id)).length
    + Number(JSON.stringify(galleries.value[page]) !== JSON.stringify(baseline.value!.draft.galleries[page]))
  const state = { slotEdits, galleries, slotsFor, replaceSlot, chooseForSlot, removeSlot, resetSlot, addToGallery, addFromLibrary, removeFromGallery, moveInGallery, changesFor }
  provide(ADMIN_IMAGES_KEY, state)
  return state
}
type AdminImagesState = ReturnType<typeof useAdminImages>
const ADMIN_IMAGES_KEY: InjectionKey<AdminImagesState> = Symbol('admin-images')
export function useAdminImagesContext() {
  const state = inject(ADMIN_IMAGES_KEY)
  if (!state) throw new Error('Image editor context missing')
  return state
}
export const usageKey = (section: string) => `admin.images.usage.${section.replace('.', '_')}`
