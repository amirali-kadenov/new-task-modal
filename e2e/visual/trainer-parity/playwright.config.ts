import { defineConfig } from '@playwright/test'

/**
 * Storybook-trainer-vs-real-host pixel parity. Unlike the catalog visual
 * suite (`e2e/visual/playwright.config.ts`), baselines here are *generated
 * every run* from the live Storybook trainer render (not committed PNGs) —
 * see `__generated__/` in `.gitignore`. Deliberately its own config/testMatch
 * so it never gets swept into `pnpm test:visual`.
 *
 * Requires Storybook (`pnpm storybook`, default http://localhost:6006) AND
 * the real trainer host (`matheducator/reactjs_client` + backend, default
 * http://localhost:8888) with auth — see `e2e/.auth.local.example.ts`.
 *
 * Env (same filters as the catalog visual suite):
 * - STORYBOOK_TEST_SCOPE — `allGroups` | `allTasks` (default: both)
 * - STORYBOOK_TEST_TEMPLATE — variant key (e.g. text/ui/plain)
 * - STORYBOOK_TEST_GRADE — class for allTasks
 * - STORYBOOK_TEST_TASK — group id or task id
 */
export default defineConfig({
  testDir: '.',
  testMatch: /trainer-parity\.spec\.ts/,
  timeout: 60_000,
  expect: {
    timeout: 45_000,
    toHaveScreenshot: {
      // Task prompt text is generated server-side per request (random
      // numbers via Elixir Enum.random — see primary_school_tasks task
      // definitions), so it can never byte-match the frozen Storybook
      // fixture. In practice that noise measures ~4-5% diff; real
      // structural regressions (missing calc-hide, missing progress-bar
      // hide, wrong container height) measured 13-18%+. 0.08 catches the
      // latter and tolerates the former — do not drop this back to a
      // stock ~0.01 without re-reading why.
      maxDiffPixelRatio: 0.08,
      animations: 'disabled',
      timeout: 45_000,
    },
  },
  fullyParallel: true,
  // Real host is a single local dev backend, not built for concurrent load —
  // 4 workers crashed it mid-run (connection refused) during a full-catalog
  // sweep. Keep this low; Storybook side is fine with more.
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  snapshotPathTemplate: '{testDir}/__generated__/{arg}{ext}',
  reporter: [['list']],
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
