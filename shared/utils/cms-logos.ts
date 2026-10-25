import type { ManagedLogo } from '../../types/cms'

/**
 * Swaps each approved logo in `source` for its published replacement.
 * Logos are matched by their approved path, so one replacement reaches every
 * place that shows it. With nothing replaced, `source` is returned as is.
 */
export function applyLogos<T>(source: T, logos: Record<string, ManagedLogo> | undefined): T {
  const replaced = new Map(Object.entries(logos ?? {}).filter(([id, logo]) => logo.src !== id))
  if (!replaced.size) return source
  const visit = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(visit)
    if (!value || typeof value !== 'object') return value
    const entry = value as Record<string, unknown>
    const logo = typeof entry.src === 'string' ? replaced.get(entry.src) : undefined
    if (logo) return { ...entry, src: logo.src, width: logo.width, height: logo.height }
    return Object.fromEntries(Object.entries(entry).map(([key, child]) => [key, visit(child)]))
  }
  return visit(source) as T
}
