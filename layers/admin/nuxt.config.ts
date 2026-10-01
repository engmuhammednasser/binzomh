import { fileURLToPath } from 'node:url'

// The layer owns dashboard UI. Server persistence and shared contracts live in
// server/cms and types/cms.ts; see README.md for the opt-in build boundary.
export default defineNuxtConfig({
  modules: [fileURLToPath(new URL('./modules/dev-only', import.meta.url))],
})
