import fs from 'node:fs'
import path from 'node:path'

import { expect, test, type Locator, type Page } from '@playwright/test'

import { LAUNCH_BASE, buildLaunchUrl } from '../../build-launch-url'
import { taskDialog } from '../../fill-answer'
import { STORYBOOK_BASE, templateCatalogStoryUrl } from '../story-url'

import {
  TRAINER_PARITY_CASES,
  type ParityCase,
} from './build-trainer-parity-cases'

/**
 * Pixel-diffs the Storybook trainer render (`Correct` story, calculator
 * force-hidden via `?calc=hidden`) against the same task on the real,
 * locally running trainer host — same shared `.task-modal` root on both
 * sides (`content.tsx` / `text-template-trainer.tsx`).
 *
 * Storybook's shot is captured fresh every run and written as the "expected"
 * file before asserting the real host against it — see `__generated__/` in
 * `.gitignore`; these are not committed baselines.
 *
 * Requires Storybook (`pnpm storybook`) AND the real trainer host + backend
 * + auth, exactly like `e2e/trainer.e2e.spec.ts` — skips (with a clear
 * reason) whichever half is unreachable, per test.
 */

const CALC_HIDDEN_QUERY = 'calc=hidden'
/** Storybook-only — see shell-fit-param.ts. No real-host equivalent. */
const SHELL_FIT_CONTENT_QUERY = 'fit=content'
const AUTH_TOKEN_COOKIE = 'math-educator-token'

type TrainerAuth = { token: string; user: string }

const LOCAL_AUTH_MODULE = '../../.auth.local'
let localAuth: Partial<TrainerAuth> = {}

try {
  const module = (await import(LOCAL_AUTH_MODULE)) as {
    localTrainerAuth?: Partial<TrainerAuth>
  }
  localAuth = module.localTrainerAuth ?? {}
} catch (error) {
  const code = (error as NodeJS.ErrnoException).code
  if (code !== 'ERR_MODULE_NOT_FOUND' && code !== 'MODULE_NOT_FOUND') {
    throw error
  }
}

const authToken = process.env.TRAINER_AUTH_TOKEN || localAuth.token
const authUser = process.env.TRAINER_AUTH_USER || localAuth.user

let storybookReachable = false
let realHostReachable = false

test.beforeAll(async () => {
  try {
    const res = await fetch(STORYBOOK_BASE, {
      signal: AbortSignal.timeout(5000),
    })
    storybookReachable = res.status < 500
  } catch {
    storybookReachable = false
  }

  if (authToken && authUser) {
    try {
      JSON.parse(authUser)
      const res = await fetch(LAUNCH_BASE, {
        signal: AbortSignal.timeout(5000),
      })
      realHostReachable = res.status < 500
    } catch {
      realHostReachable = false
    }
  }
})

test.beforeEach(async ({ context }) => {
  if (!authToken || !authUser) return
  await context.addCookies([
    { name: AUTH_TOKEN_COOKIE, value: authToken, url: LAUNCH_BASE },
  ])
  await context.addInitScript((user: string) => {
    window.localStorage.setItem('user', user)
  }, authUser)
})

const withCalcHidden = (url: string): string =>
  `${url}${url.includes('?') ? '&' : '?'}${CALC_HIDDEN_QUERY}`

const withStorybookParityParams = (url: string): string =>
  `${withCalcHidden(url)}&${SHELL_FIT_CONTENT_QUERY}`

const disableAnimations = async (page: Page) => {
  await page.addStyleTag({
    content: `
      [data-visual-hide] { display: none !important; }
      /* Storybook-only "Run interaction" test-runner bar
         (.storybook/run-play-decorator.tsx) — sticky, would otherwise
         overlay the trainer content once scrolled into view. */
      [aria-label="Interaction controls"] { display: none !important; }
      /* Real-host-only dot progress bar (OldProgressBar, old-progress-bar.tsx)
         — renders its own nested .task-modal div, real host only, no
         Storybook trainer equivalent. Hidden on both sides for parity. */
      .task-modal .task-modal { display: none !important; }
      *, *::before, *::after {
        animation: none !important;
        animation-duration: 0s !important;
        transition: none !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
    `,
  })
}

const waitForStableBox = async (root: Locator) => {
  await root.scrollIntoViewIfNeeded().catch(() => undefined)
  let prev = ''
  for (let i = 0; i < 10; i += 1) {
    const box = await root.boundingBox()
    const key = box
      ? `${Math.round(box.x)},${Math.round(box.y)},${Math.round(box.width)},${Math.round(box.height)}`
      : ''
    if (key && key === prev) return
    prev = key
    await root.page().waitForTimeout(150)
  }
}

const waitForMathSettle = async (root: Locator) => {
  await waitForStableBox(root)
  await root.page().waitForTimeout(300)
  const hasMath = (await root.locator('mjx-container').count()) > 0
  if (hasMath) {
    await expect(root.locator('mjx-merror')).toHaveCount(0)
  }
  await waitForStableBox(root)
}

const openStorybook = async (
  page: Page,
  parityCase: ParityCase,
): Promise<Locator> => {
  const url = withStorybookParityParams(
    templateCatalogStoryUrl(parityCase.storyId, parityCase.storyArgs),
  )
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForLoadState('networkidle').catch(() => undefined)
  await disableAnimations(page)

  const root = page.locator('.task-modal').first()
  await expect(root).toBeVisible({ timeout: 20_000 })
  await waitForMathSettle(root)

  return root
}

/** Open real-host deep link; reload retries if dialog missed (parallel-host flake). */
const openRealHostTask = async (
  page: Page,
  parityCase: ParityCase,
): Promise<Locator> => {
  const url = withCalcHidden(buildLaunchUrl(parityCase.launch))
  const dialog = taskDialog(page)

  for (let attempt = 0; attempt < 5; attempt += 1) {
    await page.goto(url, { waitUntil: 'load' })
    try {
      await expect(
        dialog,
        `Deep link did not open a task dialog for ${parityCase.itemId}`,
      ).toBeVisible({
        timeout: 20_000,
      })
      const root = dialog.locator('.task-modal').first()
      await expect(root).toBeVisible({ timeout: 10_000 })
      return root
    } catch (error) {
      if (attempt === 4) throw error
      await page.waitForTimeout(500)
    }
  }

  return dialog.locator('.task-modal').first()
}

/**
 * Task prompt text is generated server-side per request (random numbers),
 * so the two sides' natural content height can differ by a stray rounding
 * pixel even when structurally identical — `toHaveScreenshot` hard-fails on
 * any dimension mismatch before it even looks at pixels. Clip both captures
 * to their shared top-left region (min of each side's natural box) so the
 * comparison always runs; `maxDiffPixelRatio` (playwright.config.ts) is what
 * actually separates real structural regressions from that noise.
 */
const runCase = async (page: Page, parityCase: ParityCase) => {
  const realPage = await page.context().newPage()
  try {
    const storyRoot = await openStorybook(page, parityCase)
    const storyBox = await storyRoot.boundingBox()
    if (!storyBox) throw new Error('Storybook .task-modal has no layout box')

    const realRoot = await openRealHostTask(realPage, parityCase)
    await disableAnimations(realPage)
    await waitForMathSettle(realRoot)
    const realBox = await realRoot.boundingBox()
    if (!realBox) throw new Error('Real host .task-modal has no layout box')

    const clipWidth = Math.floor(Math.min(storyBox.width, realBox.width))
    const clipHeight = Math.floor(Math.min(storyBox.height, realBox.height))

    const storybookShot = await page.screenshot({
      clip: {
        x: storyBox.x,
        y: storyBox.y,
        width: clipWidth,
        height: clipHeight,
      },
    })

    const snapshotPath = test
      .info()
      .snapshotPath(`${parityCase.snapshotName}.png`)
    fs.mkdirSync(path.dirname(snapshotPath), { recursive: true })
    fs.writeFileSync(snapshotPath, storybookShot)

    await expect(realPage).toHaveScreenshot(`${parityCase.snapshotName}.png`, {
      clip: {
        x: realBox.x,
        y: realBox.y,
        width: clipWidth,
        height: clipHeight,
      },
      timeout: 45_000,
      animations: 'disabled',
    })
  } finally {
    await realPage.close()
  }
}

if (TRAINER_PARITY_CASES.length === 0) {
  test('trainer parity cases discovered', () => {
    test.skip(true, 'No trainer parity cases — check STORYBOOK_TEST_* filters')
  })
} else {
  for (const parityCase of TRAINER_PARITY_CASES) {
    const tag = parityCase.scope === 'allGroups' ? '[allGroups]' : '[allTasks]'
    test(`${tag} ${parityCase.template} › ${parityCase.itemId}`, async ({
      page,
    }) => {
      test.skip(
        !storybookReachable,
        `Storybook is not reachable at ${STORYBOOK_BASE} — start it with \`pnpm storybook\`.`,
      )
      test.skip(
        !authToken || !authUser,
        'Real trainer auth missing — set TRAINER_AUTH_TOKEN/TRAINER_AUTH_USER or copy e2e/.auth.local.example.ts to e2e/.auth.local.ts.',
      )
      test.skip(
        !realHostReachable,
        `Real trainer host not reachable at ${LAUNCH_BASE} — start matheducator/reactjs_client (+ backend).`,
      )
      await runCase(page, parityCase)
    })
  }
}
