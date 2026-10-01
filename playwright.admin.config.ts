import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/admin/browser',
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 45000,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4181', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'admin-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'admin-mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: 'node tests/helpers/admin-server.mjs',
    url: 'http://127.0.0.1:4181/en/admin/login',
    reuseExistingServer: false,
    env: { NITRO_HOST: '127.0.0.1', NITRO_PORT: '4181' },
  },
})
