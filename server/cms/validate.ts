import type { DatabaseSync } from 'node:sqlite'
import type { Workspace } from '../../types/cms'
import type { SiteImageFile } from '../../types/images'
import { seedWorkspace } from './seed'
import { invalid, record, stringValue } from './http'
import { SOCIAL_PLATFORMS, validateEmail, validatePhone, validateSocialUrl } from '#shared/utils/contact-validation'

export function validateWorkspace(input: unknown, db: DatabaseSync, publishing = false): Workspace {
  const value = record(input)
  const seed = seedWorkspace()
  const copy = record(value.copy)
  for (const page of Object.keys(seed.copy) as (keyof Workspace['copy'])[]) {
    const rows = copy[page]
    if (!Array.isArray(rows) || rows.length !== seed.copy[page].length) invalid('Invalid page fields')
    seed.copy[page] = seed.copy[page].map((expected, index) => {
      const row = record((rows as unknown[])[index])
      if (row.path !== expected.path) invalid('Unknown content field')
      const en = stringValue(row.en, expected.path)
      const ar = stringValue(row.ar, expected.path)
      if (publishing && (!en.trim() || !ar.trim())) invalid(`Complete both languages: ${expected.path}`)
      return { path: expected.path, en, ar }
    })
  }
  // Contact URLs are derived from these fields by the public site.
  for (const row of seed.copy.contact) {
    if (row.path === 'email' && (validateEmail(row.en) || validateEmail(row.ar))) invalid('Invalid contact email')
    if (row.path === 'phone' && (validatePhone(row.en) || validatePhone(row.ar))) invalid('Invalid contact phone')
  }
  const social = record(value.social)
  for (const platform of SOCIAL_PLATFORMS) {
    const url = stringValue(social[platform], platform, 1000).trim()
    if (validateSocialUrl(platform, url)) invalid(`Invalid ${platform} URL`)
    seed.social[platform] = url
  }
  if (!Array.isArray(value.brands) || value.brands.length !== seed.brands.length) invalid('Invalid brand roster')
  seed.brands = seed.brands.map((original, index) => {
    const brand = record((value.brands as unknown[])[index])
    if (brand.slug !== original.slug) invalid('Invalid brand')
    original.name = stringValue(brand.name, 'brand name', 150).trim()
    if (!original.name) invalid('Brand name is required')
    for (const field of ['introduction', 'relationship'] as const) {
      if (brand[field] === undefined) continue
      const entry = record(brand[field])
      if (!['approved', 'draft', 'blocked', 'missing'].includes(String(entry.status))) invalid('Invalid approval state')
      const content = record(entry.content)
      const en = stringValue(content.en ?? '', field)
      const ar = stringValue(content.ar ?? '', field)
      if (publishing && entry.status === 'approved' && (!en.trim() || !ar.trim())) invalid(`Complete both languages: ${original.slug} ${field}`)
      original[field] = { status: entry.status as 'approved' | 'draft' | 'blocked' | 'missing', content: { en, ar } }
    }
    return original
  })
  function image(value: unknown): SiteImageFile {
    const img = record(value)
    const source = stringValue(img.src, 'image path', 200)
    const existing = Object.values(seed.slots).find(entry => entry?.src === source)
    if (existing) return JSON.parse(JSON.stringify(existing))
    const name = /^\/images\/admin\/([a-f0-9-]+\.webp)$/.exec(source)?.[1]
    const media = (name ? db.prepare('SELECT width,height FROM media WHERE name=?').get(name) : undefined) as { width: number, height: number } | undefined
    if (!media) invalid('Unknown image')
    return { src: source as SiteImageFile['src'], width: media!.width, height: media!.height, formats: ['webp'], alt: 'decorative' }
  }
  const slots = record(value.slots)
  // Resolve against the immutable seed before assigning, so shared source files remain valid.
  const updatedSlots: Workspace['slots'] = {}
  for (const id of Object.keys(seed.slots)) updatedSlots[id] = slots[id] === null ? null : image(slots[id])
  const galleries = record(value.galleries)
  for (const page of Object.keys(seed.galleries) as (keyof Workspace['galleries'])[]) {
    const items = galleries[page]
    if (!Array.isArray(items) || items.length > 40) invalid('Maximum 40 gallery images per page')
    const seen = new Set<string>()
    seed.galleries[page] = (items as unknown[]).map((entry) => {
      const row = record(entry)
      const img = image(row)
      const key = stringValue(row.key, 'image key', 200)
      if (seen.has(key)) invalid('Duplicate gallery image')
      seen.add(key)
      const altEn = stringValue(row.altEn, 'image description', 500)
      const altAr = stringValue(row.altAr, 'image description', 500)
      if (publishing && (!altEn.trim() || !altAr.trim())) invalid('Describe every gallery image in both languages')
      return { key, src: img.src, width: img.width, height: img.height, altEn, altAr }
    })
  }
  seed.slots = updatedSlots
  return seed
}
