import sharp from 'sharp'
import { randomUUID } from 'node:crypto'
import { requireSession } from '../../cms/auth'
import { limitedBody } from '../../cms/http'

export default defineEventHandler(async (event) => {
  const { db } = requireSession(event, true)
  const body = await limitedBody(event, 10 * 1024 * 1024)
  let output
  try {
    const input = sharp(body, { limitInputPixels: 25_000_000, animated: false, failOn: 'warning' })
    const meta = await input.metadata()
    if (!['jpeg', 'png', 'webp', 'avif'].includes(meta.format || '') || (meta.pages ?? 1) > 1) throw new Error()
    output = await input.rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 84 }).toBuffer({ resolveWithObject: true })
  }
  catch { throw createError({ statusCode: 422, statusMessage: 'Choose a valid PNG, JPEG, WebP or AVIF image under 25 megapixels' }) }
  const usage = db.prepare('SELECT COALESCE(SUM(length(data)),0) AS size FROM media').get() as { size: number }
  if (usage.size + output.data.length > 512 * 1024 * 1024) throw createError({ statusCode: 413, statusMessage: 'Media storage limit reached' })
  const name = `${randomUUID()}.webp`
  db.prepare('INSERT INTO media VALUES(?,?,?,?)').run(name, output.data, output.info.width, output.info.height)
  return { src: `/images/admin/${name}`, width: output.info.width, height: output.info.height, formats: ['webp'], alt: 'decorative' }
})
