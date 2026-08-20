import { expect, test } from '@playwright/test'

import { buildLaunchUrl } from './build-launch-url'
import { fillAnswerViaCalculator } from './fill-answer'
import { SCOPED_TEMPLATE_FIXTURES } from './fixtures'
import {
  CHECK_BUTTON_NAME,
  expectAnswerAccepted,
  isFast,
  openTaskDialog,
  setupTrainerAuth,
} from './trainer-session'

/**
 * Real end-to-end suite: drives the actual `matheducator/reactjs_client`
 * trainer (not a Storybook mock) for tasks under
 * `src/modules/tasks/ui/templates/.../data/` (groups sample or all-tasks,
 * depending on `STORYBOOK_TEST_SCOPE`).
 *
 * Auth/reachability setup and deep-link/success helpers live in
 * `./trainer-session` (shared with `multi-input-strict.e2e.spec.ts`).
 *
 * Selectors below were found by reading `reactjs_client`'s source (no
 * dedicated test ids exist there yet), so this is best-effort:
 * - Open answers are entered via the on-screen calculator (`button[data-calc]`).
 * - `||` alternatives: first branch; `;;` splits multi-input fields.
 * - Multiple-choice clicks the `<label>` (visually-hidden radio is covered by
 *   `.radioControl` and fails Playwright's actionability checks).
 *
 * This suite is intentionally lenient (`fillAnswerViaCalculator`'s default
 * `allowRetry: true` silently clears + refills once on a bad first pass) to
 * stay non-flaky across the whole template catalog. That tolerance can mask
 * a field silently losing its value on the first pass — that specific class
 * of bug is covered separately, strictly, by `multi-input-strict.e2e.spec.ts`.
 */

setupTrainerAuth()

for (const fixture of SCOPED_TEMPLATE_FIXTURES) {
  const tag = fixture.scope === 'allTasks' ? '[allTasks]' : '[allGroups]'
  test.describe(`${tag} ${fixture.key}`, () => {
    test('new trainer accepts the correct answer', async ({ page }) => {
      // Deep-link up to 5×20s + fill/refill; keep headroom under parallel load.
      test.setTimeout(isFast ? 120_000 : 150_000)
      await openTaskDialog(page, fixture.key, buildLaunchUrl(fixture.launch))

      const checkButton = page.getByRole('button', { name: CHECK_BUTTON_NAME })
      await expect(checkButton).toBeVisible({ timeout: 15_000 })

      if (fixture.isMultipleChoice) {
        await page
          .locator(`label:has(input[type="radio"][value="${fixture.answer}"])`)
          .first()
          .click()
      } else {
        await fillAnswerViaCalculator(page, fixture.answer)
      }

      await expect(checkButton).toBeEnabled()
      await checkButton.click()

      await expectAnswerAccepted(page, checkButton)
    })
  })
}
