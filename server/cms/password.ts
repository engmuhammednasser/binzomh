import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto'

const derive = (password: string, salt: string) => new Promise<Buffer>((resolve, reject) => {
  scrypt(password, salt, 64, { N: 65536, r: 8, p: 1, maxmem: 128 * 1024 * 1024 }, (error, hash) => error ? reject(error) : resolve(hash))
})
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${(await derive(password, salt)).toString('hex')}`
}
export async function verifyPassword(password: string, stored?: string) {
  const [salt, encoded] = (stored || `${'0'.repeat(32)}:${'0'.repeat(128)}`).split(':')
  const hash = await derive(password, salt!)
  const expected = Buffer.from(encoded!, 'hex')
  return hash.length === expected.length && timingSafeEqual(hash, expected) && Boolean(stored)
}
export const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex')
