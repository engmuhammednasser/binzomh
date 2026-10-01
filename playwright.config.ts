import { defineConfig, devices } from '@playwright/test'

const staticMode = process.env.E2E_STATIC === '1'
const basePath = process.env.E2E_BASE_PATH || '/'
const origin = 'http://127.0.0.1:4173'

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 2,
  reporter: 'list',
  timeout: 45000,
  use: {
    baseURL: origin + basePath,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: staticMode ? 'node tests/helpers/static-server.mjs' : 'node .output/server/index.mjs',
    url: `${origin}${basePath}en`,
    reuseExistingServer: false,
    env: {
      NITRO_HOST: '127.0.0.1',
      NITRO_PORT: '4173',
      NUXT_PUBLIC_SITE_URL: origin,
      // Intercepted locally by Playwright. No real provider ever receives test data.
      NUXT_PUBLIC_CONTACT_FORM_ENDPOINT: '/_contact-test',
      NUXT_PUBLIC_CONTACT_FORM_SUCCESS_FIELD: 'ok',
    },
  },
})
