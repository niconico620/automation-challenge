import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 10 * 60 * 1000,

  expect: {
    timeout: 10_000,
  },

  fullyParallel: false,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {
    baseURL: 'https://www.theautomationchallenge.com',

    headless: false,

    screenshot: 'only-on-failure',

    trace: 'retain-on-failure',

    video: 'retain-on-failure',

    viewport: {
      width: 1280,
      height: 900,
    },
    launchOptions: {
      args: ['--disable-http2'],
    },
  },

  projects: [
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
});