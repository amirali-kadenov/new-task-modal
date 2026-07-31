import os from 'node:os'

import { defineConfig } from '@playwright/test'

import { LAUNCH_BASE } from './build-launch-url'

/**
 * Real e2e config:
 * - `trainer.e2e.spec.ts` → live `matheducator/reactjs_client` trainer
 *   (`LAUNCH_BASE`, default `http://localhost:8888`)
 * - `chat-input.e2e.spec.ts` → Storybook `Chat/Chat` story
 *   (`STORYBOOK_BASE`, default `http://localhost:6006`)
 *
 * Intentionally excluded from `vitest.config.ts` so it never runs as part of
 * the Storybook/unit test suite.
 *
 * Storybook Testing runner may set:
 * - `STORYBOOK_TEST_JSON` — json reporter output path
 * - `STORYBOOK_TEST_OUTPUT` — Playwright output dir (screenshots/traces/video)
 * - `STORYBOOK_TEST_SCREENSHOT=1` — screenshots on failure
 * - `STORYBOOK_TEST_SCOPE` — `all` | `allGroups` | `allTasks`
 * - `STORYBOOK_TEST_GRADE` — school class or `all`
 * - `E2E_FAST=0` — full fidelity (video/trace on failure); default is fast
 * - `E2E_WORKERS` — override Playwright workers
 * - `HEADED=1` — headed Chromium (also passed as `--headed` from preset)
 */
const storybookJson = process.env.STORYBOOK_TEST_JSON
const storybookOutput = process.env.STORYBOOK_TEST_OUTPUT
/** Fast unless explicitly disabled (`E2E_FAST=0`). */
const isFast = process.env.E2E_FAST !== '0'
const workersEnv = process.env.E2E_WORKERS
const workers = workersEnv
  ? Math.max(1, Number(workersEnv) || 1)
  : Math.max(1, os.cpus().length)

export default defineConfig({
  testDir: '.',
  timeout: isFast ? 25_000 : 45_000,
  expect: { timeout: isFast ? 8_000 : 10_000 },
  fullyParallel: true,
  workers,
  forbidOnly: Boolean(process.env.CI),
  ...(storybookOutput ? { outputDir: storybookOutput } : {}),
  reporter: storybookJson
    ? [['list'], ['json', { outputFile: storybookJson }]]
    : [['list']],
  use: {
    baseURL: LAUNCH_BASE,
    trace: isFast ? 'off' : 'retain-on-failure',
    video: isFast ? 'off' : 'retain-on-failure',
    screenshot: isFast ? 'off' : 'only-on-failure',
    ...(process.env.HEADED === '1' ? { headless: false } : {}),
  },
})
