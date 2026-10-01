import { spawnSync } from 'node:child_process'

const result = spawnSync(process.execPath, ['node_modules/nuxt/bin/nuxt.mjs', 'build'], { stdio: 'inherit', env: { ...process.env, NUXT_ADMIN_ENABLED: 'true' } })
process.exitCode = result.status ?? 1
