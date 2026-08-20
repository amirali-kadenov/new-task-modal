import os from 'node:os'

import { defineConfig, devices } from '@playwright/test'

import { LAUNCH_BASE } from './build-launch-url'

/**
 * Real e2e config:
 * - `trainer.e2e.spec.ts` → live `matheducator/reactjs_client` trainer
 *   (`LAUNCH_BASE`, default `http://localhost:8888`)
 * - `multi-input-strict.e2e.spec.ts` → same live trainer, multi-input-only,
 *   strict fill + real payload assertion; also runs on `mobile-touch`
 *   (real touch events, not just mouse `.click()`) since the bug class it
 *   guards is a click/focus-tracking race most reachable on a touch device.
 * - `chat-input.e2e.spec.ts` → Storybook `Chat/Chat` story
 *   (`STORYBOOK_BASE`, default `http://localhost:6006`)
 *
 * Two projects: `desktop` (default, everything, unchanged behavior) and
 * `mobile-touch` (Pixel 7 + real touch input, scoped via `testMatch` to only
 * `multi-input-strict.e2e.spec.ts` — running the full fixture catalog twice
 * would double e2e runtime for no benefit outside that one bug class).
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
  /** Residual parallel-host flakes (~1/2000); retry only failed tests. */
  retries: 1,
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
  projects: [
    {
      name: 'desktop',
    },
    {
      name: 'mobile-touch',
      testMatch: /multi-input-strict\.e2e\.spec\.ts$/,
      use: { ...devices['Pixel 7'], hasTouch: true },
      // Mobile-emulated Chromium contexts (touch + device scale rendering)
      // are heavier per-instance than desktop; the full `workers` count here
      // observably exhausted local resources ("Target page, context or
      // browser has been closed" on ~1/3 of runs). Cap independently of the
      // global desktop worker count.
      workers: Math.max(1, Math.min(4, workers)),
    },
  ],
})
