import { spawnSync } from 'node:child_process'

// `npm audit --audit-level=high`, except for the advisories listed here.
// Each entry names why it cannot ship a fix yet; remove it once one does.
const allowed = {
  // node-forge <=1.4.0, reached only through nuxt > nitropack > listhen,
  // which uses it for the dev server's self-signed HTTPS certificate. It
  // is not in the build output, and 1.4.0 is the latest release (checked
  // 2026-10-25), so no lockfile change can clear it.
  'GHSA-86w9-cpqp-85rv': 'node-forge, dev server only; no fixed release',
}

const result = spawnSync('npm audit --json', { shell: true, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
let report
try {
  report = JSON.parse(result.stdout)
}
catch {
  console.error(result.stdout, result.stderr)
  throw new Error('npm audit did not return a report.')
}
if (report.error) throw new Error(`npm audit failed: ${report.error.summary ?? JSON.stringify(report.error)}`)

// Every vulnerable path starts at an advisory object; plain strings in
// `via` only point at another vulnerable package.
const advisories = new Map()
for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
  for (const via of vulnerability.via) {
    if (typeof via === 'object') advisories.set(via.url.split('/').pop(), via)
  }
}

const serious = [...advisories].filter(([, advisory]) => advisory.severity === 'high' || advisory.severity === 'critical')
const blocking = serious.filter(([id]) => !allowed[id])
for (const [id] of serious.filter(([id]) => allowed[id])) console.log(`Allowed ${id}: ${allowed[id]}`)
for (const id of Object.keys(allowed).filter(id => !advisories.has(id))) console.log(`${id} no longer reported; remove it from scripts/audit.mjs.`)

if (blocking.length) {
  for (const [id, advisory] of blocking) console.error(`${advisory.severity}: ${advisory.name} ${advisory.range}: ${advisory.title} (${id})`)
  process.exitCode = 1
}
else {
  console.log('No high or critical advisories outside the allowlist.')
}
