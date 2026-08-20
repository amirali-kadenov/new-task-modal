import { expect, test } from '@playwright/test'

import { buildLaunchUrl } from './build-launch-url'
import { fillAnswerViaCalculator, taskDialog } from './fill-answer'
import { SCOPED_TEMPLATE_FIXTURES } from './fixtures'
import {
  CHECK_BUTTON_NAME,
  isFast,
  openTaskDialog,
  setupTrainerAuth,
} from './trainer-session'

/**
 * Regression e2e for the lives/hearts bug reported against the real trainer:
 * after exhausting 3 attempts on a task, the trainer inserts "penalty" tasks
 * and moves you to the first one. The lives-indicator heart count must
 * reflect that new task's real queue position — 1 life when more penalty
 * tasks still follow it, 2 only when it's the last (or only) one — instead
 * of being stuck at 2 regardless of position (see
 * `src/modules/task-modal/ui/content/header/lives-indicator/lib.ts`).
 *
 * Picks one simple single-field numeric fixture; this test only needs one
 * flow through the mechanism, not per-template coverage (that's
 * `trainer.e2e.spec.ts`'s job).
 */

setupTrainerAuth()

const NEXT_BUTTON_NAME = /следующий|келесі|next/i

const fixture = SCOPED_TEMPLATE_FIXTURES.find(
  (f) => !f.isMultipleChoice && /^\d+$/.test(f.answer),
)

test('lives count reflects real penalty-task position after 3 wrong answers', async ({
  page,
}) => {
  test.skip(!fixture, 'No single-field numeric fixture available for lives e2e')
  test.setTimeout(isFast ? 60_000 : 90_000)
  if (!fixture) return

  await openTaskDialog(page, fixture.key, buildLaunchUrl(fixture.launch))

  const dialog = taskDialog(page)
  // Scoped to the dialog: "Келесі" ("next") also matches unrelated
  // pagination controls elsewhere on the page, which caused a silent
  // Playwright strict-mode violation (swallowed by `.catch(() => false)`
  // below) and made the settle-poll hang forever.
  const checkButton = dialog.getByRole('button', { name: CHECK_BUTTON_NAME })
  const nextButton = dialog.getByRole('button', { name: NEXT_BUTTON_NAME })
  const tasksNum = page.getByTestId('tasks-num')

  const initialTasksNumText = await tasksNum.innerText()
  const initialTotal = Number(initialTasksNumText.match(/\/(\d+)/)?.[1])
  expect(
    Number.isFinite(initialTotal),
    `Could not parse total task count from "${initialTasksNumText}"`,
  ).toBe(true)

  const correctNumber = Number(fixture.answer)

  /** Field must be cleared before each retry — `fillAnswerViaCalculator` types on top of whatever is already there, and a wrong answer never auto-clears (only a correct one does, via `resetValues()`). */
  const clearField = async () => {
    const field = taskDialog(page).locator('[data-input]').first()
    await field.click({ force: true })
    const deleteKey = page.getByRole('button', { name: 'Delete' })
    await expect(deleteKey).toBeVisible({ timeout: 5_000 })
    for (let i = 0; i < 15; i += 1) {
      await deleteKey.click()
    }
  }

  // After a wrong-but-not-exhausted submit, Check goes back to *disabled*
  // (same failed answer still sits in the field) — it only re-enables once a
  // new value is typed next iteration. So "settled" means the in-flight
  // request finished (`aria-busy` cleared), not that Check is enabled again.
  // Runs entirely in-page (`waitForFunction`) rather than round-tripping
  // several separate locator calls per poll tick — those were occasionally
  // hanging mid-tick on this page (likely the dialog's fast re-renders
  // during the exhausting 3rd submit), which just wedged the whole retry
  // loop for 15s+ with no error.
  const waitForAttemptSettled = () =>
    page.waitForFunction(
      () => {
        const buttons = [...document.querySelectorAll('[role="dialog"] button')]
        const isNext = (b: Element) =>
          /следующий|келесі|next/i.test(b.textContent ?? '')
        const isCheck = (b: Element) =>
          /проверить|тексеру/i.test(b.textContent ?? '')

        if (buttons.some(isNext)) return true

        const check = buttons.find(isCheck)
        return check ? check.getAttribute('aria-busy') !== 'true' : true
      },
      undefined,
      { timeout: 15_000 },
    )

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    if (await nextButton.isVisible().catch(() => false)) break

    // A different wrong value each time — submitting the same wrong answer
    // twice in a row is a no-op in the UI (disabled Check button).
    await clearField()
    await fillAnswerViaCalculator(page, String(correctNumber + attempt), {
      allowRetry: false,
    })
    await expect(checkButton).toBeEnabled({ timeout: 10_000 })
    await checkButton.click()
    await page.waitForTimeout(150) // let isLoading/aria-busy flip before polling
    await waitForAttemptSettled()
  }

  await expect(
    nextButton,
    'Expected the "next" button after 3 wrong answers (attempts exhausted)',
  ).toBeVisible({ timeout: 15_000 })

  const afterTasksNumText = await tasksNum.innerText()
  const numbers = [...afterTasksNumText.matchAll(/\d+/g)].map((m) =>
    Number(m[0]),
  )
  // hasAdditionalTasks → [position, initialTotal, newTotal]; otherwise → [position, total]
  const newTotal = numbers.length >= 3 ? numbers[2] : numbers[1]
  const insertedCount = newTotal - initialTotal

  expect(
    insertedCount,
    `Expected at least one penalty task inserted (before: "${initialTasksNumText}", after: "${afterTasksNumText}")`,
  ).toBeGreaterThan(0)

  await nextButton.click()

  const livesCount = page.getByTestId('lives-count')
  await expect(livesCount).toBeVisible({ timeout: 15_000 })
  const shown = Number(await livesCount.innerText())

  const expected = insertedCount === 1 ? 2 : 1
  expect(
    shown,
    `Expected ${expected} lives on the ${
      insertedCount === 1 ? 'only' : 'first, non-last'
    } penalty task (${insertedCount} inserted), got ${shown}`,
  ).toBe(expected)
})
