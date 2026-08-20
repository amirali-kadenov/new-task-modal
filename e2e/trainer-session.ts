/**
 * Shared real-trainer session plumbing for e2e specs that drive the actual
 * `matheducator/reactjs_client` trainer (not a Storybook mock):
 * - `setupTrainerAuth()` — pupil auth cookie/localStorage + reachability
 *   check, registered as `beforeAll`/`beforeEach` in the calling spec file.
 * - `openTaskDialog` / `expectAnswerAccepted` — deep-link open + success poll.
 *
 * Extracted from `trainer.e2e.spec.ts` so `multi-input-strict.e2e.spec.ts`
 * can reuse the same auth/dialog plumbing without duplicating it.
 */
import { expect, test, type Locator, type Page } from '@playwright/test'

import { LAUNCH_BASE } from './build-launch-url'
import { taskDialog } from './fill-answer'

export const CHECK_BUTTON_NAME = /Проверить|Тексеру/
const AUTH_TOKEN_COOKIE = 'math-educator-token'
/** `E2E_FAST=0` enables full fidelity (longer timeouts, video/trace via playwright.config); default is fast. */
export const isFast = process.env.E2E_FAST !== '0'

type TrainerAuth = {
  token: string
  user: string
}

const LOCAL_AUTH_MODULE = './.auth.local'
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

let auth: TrainerAuth

/**
 * Registers `beforeAll`/`beforeEach` hooks (real pupil auth cookie +
 * localStorage, plus a live-trainer reachability check) for the calling spec
 * file. Call once at module scope in any spec that drives the real
 * matheducator trainer at `LAUNCH_BASE`.
 *
 * The `?grade=&chapterId=&lessonId=&taskIndex=` deep link only opens a task
 * for an already-authenticated pupil — there's no guest/preview route, and
 * this repo ships no test credentials. Provide `TRAINER_AUTH_TOKEN` (the
 * `math-educator-token` cookie value) and `TRAINER_AUTH_USER` (the JSON
 * `user` localStorage value), or create gitignored `.auth.local.ts`.
 */
export const setupTrainerAuth = (): void => {
  test.beforeAll(async () => {
    if (!authToken || !authUser) {
      throw new Error(
        'Trainer E2E requires authentication. Set TRAINER_AUTH_TOKEN and ' +
          'TRAINER_AUTH_USER, or copy e2e/.auth.local.example.ts to ' +
          'e2e/.auth.local.ts and fill it from an authenticated pupil session.',
      )
    }

    try {
      JSON.parse(authUser)
    } catch {
      throw new Error(
        'Trainer E2E auth user is not valid JSON. Use the complete value of ' +
          'Application > Local Storage > user.',
      )
    }

    auth = { token: authToken, user: authUser }

    let response: Response
    try {
      response = await fetch(LAUNCH_BASE, {
        signal: AbortSignal.timeout(5000),
      })
    } catch (error) {
      throw new Error(
        `Real trainer app is not reachable at ${LAUNCH_BASE}. Start ` +
          'matheducator/reactjs_client (+ backend) before running E2E.',
        { cause: error },
      )
    }

    if (response.status >= 500) {
      throw new Error(
        `Real trainer app at ${LAUNCH_BASE} returned HTTP ${response.status}.`,
      )
    }
  })

  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: AUTH_TOKEN_COOKIE, value: auth.token, url: LAUNCH_BASE },
    ])
    await context.addInitScript((user: string) => {
      window.localStorage.setItem('user', user)
    }, auth.user)
  })
}

/**
 * Success signal: check button becomes disabled again, OR the task dialog
 * closes (correct answer may advance / dismiss the modal).
 */
export const expectAnswerAccepted = async (
  _page: Page,
  checkButton: Locator,
): Promise<void> => {
  await expect
    .poll(
      async () => {
        if ((await checkButton.count()) === 0) return 'gone'
        if (!(await checkButton.isVisible())) return 'gone'
        if (await checkButton.isDisabled()) return 'disabled'
        return 'pending'
      },
      {
        timeout: 15_000,
        message:
          'Expected check button to become disabled or the task dialog to close after a correct answer',
      },
    )
    .not.toBe('pending')
}

/** Open trainer deep-link; reload retries if dialog missed (parallel-host flake). */
export const openTaskDialog = async (
  page: Page,
  fixtureKey: string,
  launchUrl: string,
) => {
  const dialog = taskDialog(page)
  const message = `Deep link did not open a task dialog for ${fixtureKey}`
  const answerReady = dialog.locator('[data-input], input[type="radio"]')

  for (let attempt = 0; attempt < 5; attempt += 1) {
    await page.goto(launchUrl, { waitUntil: 'load' })
    try {
      await expect(dialog, message).toBeVisible({ timeout: 20_000 })
      await expect(
        answerReady.first(),
        `${message} (dialog open but no answer field)`,
      ).toBeVisible({ timeout: 10_000 })
      return dialog
    } catch (error) {
      if (attempt === 4) throw error
      await page.waitForTimeout(500)
    }
  }

  return dialog
}
