import type { CopyRow } from '../../types/cms'

const SKIP = new Set(['status', 'note', 'src', 'to', 'href', 'slug', 'id', 'channel', 'icon', 'channelIcons', 'photo', 'imageSlotId'])
export function collectCopy(en: unknown, ar: unknown, path = '', rows: CopyRow[] = []): CopyRow[] {
  if (typeof en === 'string') rows.push({ path, en, ar: typeof ar === 'string' ? ar : '' })
  else if (en && typeof en === 'object') {
    for (const [key, value] of Object.entries(en)) {
      if (!SKIP.has(key)) collectCopy(value, (ar as Record<string, unknown> | undefined)?.[key], path ? `${path}.${key}` : key, rows)
    }
  }
  return rows
}

/** Only replace existing string leaves. Paths never create properties or traverse prototypes. */
export function applyCopy<T>(source: T, rows: CopyRow[], locale: 'en' | 'ar'): T {
  const copy = JSON.parse(JSON.stringify(source)) as T
  for (const row of rows) {
    const parts = row.path.split('.')
    let target: unknown = copy
    for (const key of parts.slice(0, -1)) {
      target = target && typeof target === 'object' && Object.hasOwn(target, key)
        ? (target as Record<string, unknown>)[key]
        : undefined
    }
    const key = parts.at(-1)!
    if (target && typeof target === 'object' && Object.hasOwn(target, key)
      && typeof (target as Record<string, unknown>)[key] === 'string') {
      (target as Record<string, unknown>)[key] = row[locale]
    }
  }
  return copy
}
