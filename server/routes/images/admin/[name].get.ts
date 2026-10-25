import { adminContext, requireSession } from '../../../cms/auth'
import { storedWorkspace } from '../../../cms/store'
import type { Workspace } from '../../../../types/cms'

export default defineEventHandler((event) => {
  const { db } = adminContext(event)
  const name = getRouterParam(event, 'name') || ''
  if (!/^[a-f0-9-]+\.webp$/.test(name)) throw createError({ statusCode: 404 })
  const published: Workspace = JSON.parse(storedWorkspace(db).published)
  const src = `/images/admin/${name}`
  const visible = Object.values(published.slots).some(image => image?.src === src)
    || Object.values(published.galleries).some(items => items.some(image => image.src === src))
    || Object.values(published.logos ?? {}).some(logo => logo.src === src)
  if (!visible) requireSession(event)
  const row = db.prepare('SELECT data FROM media WHERE name=?').get(name) as { data: Uint8Array } | undefined
  if (!row) throw createError({ statusCode: 404 })
  setHeader(event, 'Content-Type', 'image/webp')
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  return Buffer.from(row.data)
})
