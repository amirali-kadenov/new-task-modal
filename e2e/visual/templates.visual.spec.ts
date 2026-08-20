import { expect, test, type Locator, type Page } from '@playwright/test'

import { VISUAL_CASES, type VisualCase } from './load-visual-cases'
import { STORYBOOK_BASE, templateCatalogStoryUrl } from './story-url'

/**
 * Playwright visual regression for template catalog stories.
 * Two screenshots per group/task: default + solution.
 *
 * Requires Storybook at STORYBOOK_BASE (default http://localhost:6006).
 */

let storybookIsRunning = false

test.beforeAll(async () => {
  try {
    const response = await fetch(STORYBOOK_BASE, {
      signal: AbortSignal.timeout(5000),
    })
    storybookIsRunning = response.status < 500
  } catch {
    storybookIsRunning = false
  }
})

const hideVisualChrome = async (page: Page) => {
  await page.addStyleTag({
    content: `
      [data-visual-hide] { display: none !important; }
      .sb-preparing-story, .sb-preparing-docs { display: none !important; }
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

const targetLocator = (page: Page, visualCase: VisualCase): Locator => {
  const sel = `[data-visual-target="${visualCase.variant}"]`
  if (visualCase.scope === 'allTasks') {
    return page.locator(`[data-task="${visualCase.itemId}"] ${sel}`).first()
  }
  return page.locator(sel).first()
}

const runCase = async (page: Page, visualCase: VisualCase) => {
  const url = templateCatalogStoryUrl(visualCase.storyId, visualCase.args)
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForLoadState('networkidle').catch(() => undefined)
  await hideVisualChrome(page)

  const target = targetLocator(page, visualCase)

  try {
    await expect(target).toBeVisible({ timeout: 15_000 })
  } catch {
    await page.reload({ waitUntil: 'domcontentloaded' })
    await hideVisualChrome(page)
    await expect(target).toBeVisible({ timeout: 20_000 })
  }
  await waitForMathSettle(target)

  await expect(target).toHaveScreenshot(`${visualCase.snapshotName}.png`, {
    timeout: 45_000,
    animations: 'disabled',
  })
}

if (VISUAL_CASES.length === 0) {
  test('visual cases discovered', () => {
    test.skip(true, 'No visual cases — check STORYBOOK_TEST_* filters')
  })
} else {
  for (const visualCase of VISUAL_CASES) {
    const tag = visualCase.scope === 'allGroups' ? '[allGroups]' : '[allTasks]'
    test(`${tag} ${visualCase.template} › ${visualCase.itemId} › ${visualCase.variant}`, async ({
      page,
    }) => {
      test.skip(
        !storybookIsRunning,
        `Storybook is not reachable at ${STORYBOOK_BASE} — start it with ` +
          '`pnpm storybook` to run visual tests.',
      )
      await runCase(page, visualCase)
    })
  }
}
