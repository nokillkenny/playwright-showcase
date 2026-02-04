import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'https://nokillkenny.github.io/';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 4 : 2,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});
