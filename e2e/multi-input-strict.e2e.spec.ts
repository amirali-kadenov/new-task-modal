import { expect, test } from '@playwright/test'

import { buildLaunchUrl } from './build-launch-url'
import { answerParts, fillAnswerViaCalculator } from './fill-answer'
import { TEMPLATE_FIXTURES } from './fixtures'
import {
  CHECK_BUTTON_NAME,
  expectAnswerAccepted,
  isFast,
  openTaskDialog,
  setupTrainerAuth,
} from './trainer-session'

/**
 * Focused regression suite for multi-input answercell-family templates
 * (2+ MathQuill fields joined with `;;` on the wire — see `multi-answer.ts`).
 *
 * A real bug shipped once where one field's value was silently dropped from
 * the submitted answer despite the UI looking fully filled — a pupil lost a
 * life on a correct answer. `trainer.e2e.spec.ts` ran this exact template
 * repeatedly and never caught it, for two reasons this suite fixes:
 *
 * 1. `fillAnswerViaCalculator`'s default `allowRetry: true` silently clears
 *    and refills once on a bad first pass — the retry papered over exactly
 *    the failure mode being hunted. Here we use `{ allowRetry: false }`: one
 *    honest pass, fail loud if it doesn't stick.
 * 2. The lenient suite only checks the UI outcome (check button disabled) —
 *    it never looks at what was actually sent. Here we intercept the real
 *    `POST /tasks/:id/answers` request and assert every expected field value
 *    made it into the joined `answer` string.
 *
 * Runs against `TEMPLATE_FIXTURES` (unscoped — always the full multi-input
 * set) rather than `SCOPED_TEMPLATE_FIXTURES`, so it isn't affected by
 * `STORYBOOK_TEST_SCOPE`/`STORYBOOK_TEST_TEMPLATE` env filtering.
 */

setupTrainerAuth()

const MULTI_INPUT_FIXTURES = TEMPLATE_FIXTURES.filter(
  (fixture) =>
    !fixture.isMultipleChoice && answerParts(fixture.answer).length > 1,
)

for (const fixture of MULTI_INPUT_FIXTURES) {
  test.describe(`[multi-input-strict] ${fixture.key}`, () => {
    test('submits every field in one honest pass — real payload has all parts', async ({
      page,
    }) => {
      test.setTimeout(isFast ? 60_000 : 90_000)
      await openTaskDialog(page, fixture.key, buildLaunchUrl(fixture.launch))

      const checkButton = page.getByRole('button', {
        name: CHECK_BUTTON_NAME,
      })
      await expect(checkButton).toBeVisible({ timeout: 15_000 })

      // Start listening before the triggering click (Playwright pattern) —
      // resolves with the real POST once the check button is clicked below.
      const answersRequestPromise = page
        .waitForRequest(
          (request) =>
            request.method() === 'POST' &&
            /\/tasks\/[^/]+\/answers$/.test(request.url()),
          { timeout: isFast ? 20_000 : 30_000 },
        )
        .catch(() => null)

      await fillAnswerViaCalculator(page, fixture.answer, {
        allowRetry: false,
      })

      await expect(checkButton).toBeEnabled()
      await checkButton.click()
      await expectAnswerAccepted(page, checkButton)

      const answersRequest = await answersRequestPromise
      expect(
        answersRequest,
        'No POST /tasks/:id/answers request was captured',
      ).toBeTruthy()

      const capturedPayload = answersRequest?.postDataJSON() as {
        answer?: string
      } | null
      const expectedParts = answerParts(fixture.answer)
      const sentAnswer = capturedPayload?.answer ?? ''
      const sentParts = sentAnswer.split(';;')

      expect(
        sentParts.length,
        `Expected ${expectedParts.length} joined field(s) in the submitted ` +
          `answer, got ${JSON.stringify(sentParts)} (raw: ${JSON.stringify(sentAnswer)})`,
      ).toBe(expectedParts.length)

      for (const [index, part] of sentParts.entries()) {
        expect(
          part.trim().length,
          `Field #${index} is empty in the submitted multi-answer: ${JSON.stringify(sentParts)}`,
        ).toBeGreaterThan(0)
      }
    })
  })
}
