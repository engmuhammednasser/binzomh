import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createServer } from 'node:net'
import process from 'node:process'

export async function startServer(origin) {
  const reservation = createServer()
  reservation.listen(0, '127.0.0.1')
  await once(reservation, 'listening')
  const { port } = reservation.address()
  await new Promise(resolve => reservation.close(resolve))
  const env = { ...process.env, NITRO_HOST: '127.0.0.1', NITRO_PORT: String(port) }
  delete env.NUXT_PUBLIC_SITE_URL
  delete env.NITRO_UNIX_SOCKET
  if (origin) env.NUXT_PUBLIC_SITE_URL = origin
  const child = spawn(process.execPath, ['.output/server/index.mjs'], { env, stdio: ['ignore', 'pipe', 'pipe'] })
  let output = ''
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Server startup timed out: ${output}`)), 15000)
      child.once('error', (error) => {
        clearTimeout(timeout)
        reject(error)
      })
      child.once('exit', (code) => {
        clearTimeout(timeout)
        reject(new Error(`Server exited (${code}): ${output}`))
      })
      child.stderr.on('data', chunk => output += chunk)
      child.stdout.on('data', (chunk) => {
        output += chunk
        if (output.includes('Listening on')) {
          clearTimeout(timeout)
          resolve()
        }
      })
    })
  }
  catch (error) {
    child.kill()
    throw error
  }
  return {
    base: `http://127.0.0.1:${port}`,
    get output() { return output },
    async stop() {
      if (child.exitCode !== null) return
      const closed = once(child, 'exit')
      child.kill()
      await closed
    },
  }
}
