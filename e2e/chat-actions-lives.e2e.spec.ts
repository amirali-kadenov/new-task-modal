import { expect, test } from '@playwright/test'

import { buildLaunchUrl } from './build-launch-url'
import { fillAnswerViaCalculator, taskDialog } from './fill-answer'
import { SCOPED_TEMPLATE_FIXTURES } from './fixtures'
import { isFast, openTaskDialog, setupTrainerAuth } from './trainer-session'

/**
 * Regression e2e for the chat "Смотреть пример" / "Показать ответ" actions:
 * clicking either is a "give up" action — it burns the task's remaining
 * lives and marks the task solved (`use-show-solution.ts` /
 * `use-show-video-explanation.ts` unconditionally set `attemptsCount`/
 * `solution` on the active task), which is what flips the main button from
 * "Проверить" to "Далее" and is also what makes the solution render inline
 * in the trainer itself (every per-template `*-solution.tsx` renders off
 * that same `task.solution` field), not just inside the chat message.
 *
 * The one thing that must NOT happen is the "Далее" button getting stuck
 * disabled — `actions.tsx` used to wire `isLoading={isTransitioning}` into
 * it, so a stuck `isTransitioning` stuck the button too. Fixed by never
 * disabling that button (`isLoading={false}`).
 */

setupTrainerAuth()

const NEXT_BUTTON_NAME = /следующий|келесі|next/i

const numericFixtures = SCOPED_TEMPLATE_FIXTURES.filter(
  (f) => !f.isMultipleChoice && /^\d+$/.test(f.answer),
)

const openChatAndClick = async (
  page: import('@playwright/test').Page,
  buttonText: string,
) => {
  const dialog = taskDialog(page)
  await dialog.getByRole('button', { name: 'Открыть чат' }).click()

  const chatHeading = page.getByRole('heading', { name: 'AI-чат' })
  await expect(chatHeading).toBeVisible({ timeout: 10_000 })

  await page.getByText(buttonText, { exact: true }).click()

  // Close via the TopBar's only button (no back-button in this context).
  await chatHeading.locator('xpath=..').getByRole('button').click()
  await expect(chatHeading).not.toBeVisible({ timeout: 10_000 })
}

test.describe('Chat "give up" actions (theory / show-answer)', () => {
  test('"Смотреть пример" never leaves the flow stuck', async ({ page }) => {
    const fixture = numericFixtures[0]
    test.skip(!fixture, 'No single-field numeric fixture available')
    test.setTimeout(isFast ? 60_000 : 90_000)
    if (!fixture) return

    await openTaskDialog(page, fixture.key, buildLaunchUrl(fixture.launch))
    const dialog = taskDialog(page)
    const checkButton = dialog.getByRole('button', {
      name: /Проверить|Тексеру/,
    })
    const nextButton = dialog.getByRole('button', { name: NEXT_BUTTON_NAME })

    await openChatAndClick(page, 'Смотреть пример')

    // The backend decides whether viewing the example ends the attempt
    // (empty `solution` in the response keeps it in "check" mode — a video
    // example isn't necessarily the same as giving up, unlike explicitly
    // asking for the answer). Whichever mode it lands in, the flow must not
    // be stuck.
    if (await nextButton.isVisible().catch(() => false)) {
      await expect(nextButton).toBeEnabled()
      expect(await nextButton.getAttribute('disabled')).toBeNull()
      await nextButton.click()
      await expect(nextButton).toBeEnabled()
      return
    }

    await expect(
      checkButton,
      'If Смотреть пример did not end the attempt, Проверить must still be usable',
    ).toBeVisible({ timeout: 10_000 })

    const correctNumber = Number(fixture.answer)
    await fillAnswerViaCalculator(page, String(correctNumber), {
      allowRetry: false,
    })
    await expect(checkButton).toBeEnabled({ timeout: 10_000 })
    await checkButton.click()

    await expect
      .poll(
        async () => {
          if ((await nextButton.count()) > 0 && (await nextButton.isVisible()))
            return 'next'
          if ((await checkButton.count()) === 0) return 'closed'
          return (await checkButton.isDisabled()) ? 'disabled' : 'pending'
        },
        { timeout: 15_000 },
      )
      .not.toBe('pending')
  })

  test('"Показать ответ" ends the attempt (Далее appears) and Далее is never disabled', async ({
    page,
  }) => {
    const fixture = numericFixtures[1]
    test.skip(!fixture, 'No second single-field numeric fixture available')
    test.setTimeout(isFast ? 60_000 : 90_000)
    if (!fixture) return

    await openTaskDialog(page, fixture.key, buildLaunchUrl(fixture.launch))
    const dialog = taskDialog(page)
    const checkButton = dialog.getByRole('button', {
      name: /Проверить|Тексеру/,
    })
    const nextButton = dialog.getByRole('button', { name: NEXT_BUTTON_NAME })

    const correctNumber = Number(fixture.answer)

    // One wrong attempt first — Показать ответ should still end the attempt
    // (burn remaining lives) even though it wasn't the 3rd/last one.
    await fillAnswerViaCalculator(page, String(correctNumber + 1), {
      allowRetry: false,
    })
    await expect(checkButton).toBeEnabled({ timeout: 10_000 })
    await checkButton.click()
    await page.waitForTimeout(150)

    await openChatAndClick(page, 'Показать ответ')

    await expect(
      nextButton,
      'Показать ответ is a give-up action — Далее must appear',
    ).toBeVisible({ timeout: 15_000 })

    await expect(nextButton).toBeEnabled()
    expect(await nextButton.getAttribute('disabled')).toBeNull()

    await nextButton.click()
    await expect(nextButton).toBeEnabled()
  })
})
