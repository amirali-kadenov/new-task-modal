import { defineConfig } from '@playwright/test'

/**
 * Visual regression against Storybook Groups / Tasks catalog stories.
 *
 * Requires Storybook (`pnpm storybook`, default http://localhost:6006).
 *
 * Env (same filters as Testing hub):
 * - STORYBOOK_TEST_SCOPE — `allGroups` (default) | `allTasks`
 * - STORYBOOK_TEST_TEMPLATE — variant key (e.g. text/ui/plain)
 * - STORYBOOK_TEST_GRADE — class for allTasks
 * - STORYBOOK_TEST_TASK — group id or task id
 * - STORYBOOK_TEST_VISUAL_ALL=1 — all templates (not only pilots)
 * - STORYBOOK_TEST_JSON / STORYBOOK_TEST_OUTPUT — Testing hub reporters
 */
const storybookJson = process.env.STORYBOOK_TEST_JSON
const storybookOutput = process.env.STORYBOOK_TEST_OUTPUT

export default defineConfig({
  testDir: '.',
  testMatch: /.*\.visual\.spec\.ts/,
  timeout: 60_000,
  expect: {
    timeout: 45_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      timeout: 45_000,
    },
  },
  fullyParallel: true,
  workers: 2,
  retries: 2,
  forbidOnly: Boolean(process.env.CI),
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFileName}/{arg}{ext}',
  ...(storybookOutput ? { outputDir: storybookOutput } : {}),
  reporter: storybookJson
    ? [['list'], ['json', { outputFile: storybookJson }]]
    : [['list']],
  use: {
    trace: 'off',
    video: 'off',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    ...(process.env.HEADED === '1' ? { headless: false } : {}),
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
