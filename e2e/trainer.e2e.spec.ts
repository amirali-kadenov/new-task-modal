import { expect, test, type Page } from '@playwright/test'

import { buildLaunchUrl, LAUNCH_BASE } from './build-launch-url'
import { SCOPED_TEMPLATE_FIXTURES } from './fixtures'

/**
 * Real end-to-end suite: drives the actual `matheducator/reactjs_client`
 * trainer (not a Storybook mock) for tasks under
 * `src/modules/tasks/ui/templates/.../data/` (groups sample or all-tasks,
 * depending on `STORYBOOK_TEST_SCOPE`).
 *
 * Requires `matheducator/reactjs_client` (+ backend) running locally at
 * `LAUNCH_BASE` (default `http://localhost:8888`) — this is a separate repo
 * this project doesn't start automatically, so the suite fails with setup
 * instructions when it isn't reachable.
 *
 * The `?grade=&chapterId=&lessonId=&taskIndex=` deep link only opens a task
 * for an already-authenticated pupil — there's no guest/preview route, and
 * this repo ships no test credentials. Provide `TRAINER_AUTH_TOKEN` (the
 * `math-educator-token` cookie value) and `TRAINER_AUTH_USER` (the JSON
 * `user` localStorage value), or create gitignored `.auth.local.ts`.
 *
 * Selectors below were found by reading `reactjs_client`'s source (no
 * dedicated test ids exist there yet), so this is best-effort:
 * - New trainer has no success toast/badge yet — a correct answer just
 *   clears the input, so "check button goes back to disabled" is the only
 *   reliable success signal (mirrors the Storybook `play` test).
 * - Multi-input answers use `;;` (same as Storybook plays); each part is
 *   typed into the matching field in order.
 *
 * Speed: `E2E_FAST=0` enables full fidelity (longer timeouts, video/trace via
 * playwright.config); default is fast.
 */

const CHECK_BUTTON_NAME = /Проверить|Тексеру/
const AUTH_TOKEN_COOKIE = 'math-educator-token'
const MULTI_ANSWER_SEPARATOR = ';;'
const isFast = process.env.E2E_FAST !== '0'

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

const answerParts = (answer: string): string[] =>
  answer.split(MULTI_ANSWER_SEPARATOR).map((part) => part.trim())

const fillMathInputs = async (page: Page, parts: string[]) => {
  const fields = page.locator('[data-input]')
  await expect(
    fields.first(),
    `Expected a visible answer input for ${JSON.stringify(parts)}`,
  ).toBeVisible({ timeout: 15_000 })

  const count = await fields.count()
  expect(
    count,
    `Expected at least ${parts.length} input(s) for ${JSON.stringify(parts)}, found ${count}`,
  ).toBeGreaterThanOrEqual(parts.length)

  for (const [index, part] of parts.entries()) {
    await fields.nth(index).click()
    await page.keyboard.type(part)
  }
}

for (const fixture of SCOPED_TEMPLATE_FIXTURES) {
  const tag = fixture.scope === 'allTasks' ? '[allTasks]' : '[allGroups]'
  test.describe(`${tag} ${fixture.key}`, () => {
    test.beforeEach(() => {
      if (fixture.skipReason) {
        throw new Error(
          `Template fixture ${fixture.key} cannot run: ${fixture.skipReason}`,
        )
      }
    })

    test('new trainer accepts the correct answer', async ({ page }) => {
      test.setTimeout(isFast ? 30_000 : 45_000)
      await page.goto(buildLaunchUrl(fixture.launch))

      const checkButton = page.getByRole('button', { name: CHECK_BUTTON_NAME })
      await expect(checkButton).toBeVisible({ timeout: 15_000 })

      if (fixture.isMultipleChoice) {
        await page
          .locator(`input[type="radio"][value="${fixture.answer}"]`)
          .first()
          .click()
      } else {
        await fillMathInputs(page, answerParts(fixture.answer))
      }

      await expect(checkButton).toBeEnabled()
      await checkButton.click()

      await expect(checkButton).toBeDisabled({ timeout: 10_000 })
    })
  })
}
