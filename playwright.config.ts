import { defineConfig } from '@playwright/test';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. */
  reporter: 'null',
  /* Shared settings for all the projects below. */
  use: {
    headless: false,
    screenshot: 'on',
    trace: 'on-first-retry',
    userAgent: 'D2CEST-AUTO-70a4cf16 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36.D2CEST-AUTO-70a4cf16',
    viewport: null,
    launchOptions: { args: ['--start-maximized'] }
  },
  timeout: 300000,

  /* Configure projects */
  projects: [
    {
      name: 'Core',
      testDir: 'tests'
    },
    {
      name: 'Regression',
      testDir: 'regression',
      use: {
        contextOptions: {
          permissions: ['clipboard-read', 'clipboard-write'],
        }
      },
    }
  ],
});
