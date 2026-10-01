import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'

const root = resolve('.output/public')
const base = (process.env.E2E_BASE_PATH || '/').replace(/\/$/, '')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2' }
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    if (base && pathname !== base && !pathname.startsWith(`${base}/`)) throw new Error('Outside base')
    let file = resolve(root, `.${pathname.slice(base.length) || '/'}`)
    if (file !== root && !file.startsWith(root + sep)) throw new Error('Outside root')
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html')
    response.setHeader('content-type', types[extname(file)] || 'application/octet-stream')
    response.end(await readFile(file))
  }
  catch {
    response.writeHead(404, { 'content-type': 'text/plain' })
    response.end('Not found')
  }
}).listen(4173, '127.0.0.1', () => console.log('Static preview listening on 4173'))
