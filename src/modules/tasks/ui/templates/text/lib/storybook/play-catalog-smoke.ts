import { expect, within } from 'storybook/test'

import { GRADE_ENV, parseGradeEnv } from '@/modules/testing/lib/test-scope'
import { isAutomatedInteractionRun } from '@/testing/with-on-demand-play'
import { assertNoMathJaxErrors } from '@/ui/math-text/assert-mathjax-dom'

type PlayCanvasArgs = {
  canvasElement: HTMLElement
  args?: { grade?: number; group?: string }
}

type PlayFn = (context: PlayCanvasArgs) => Promise<void>

/**
 * Smoke play for Groups / Tasks catalog stories.
 * Runs only under Vitest (catalog stories use skipRunPlayButton — no UI chrome).
 */
const catalogSmoke =
  (kind: 'allGroups' | 'allTasks'): PlayFn =>
  async ({ canvasElement, args }) => {
    if (!isAutomatedInteractionRun()) return

    const gradeFilter = parseGradeEnv(
      typeof process !== 'undefined' ? process.env[GRADE_ENV] : undefined,
    )

    if (kind === 'allTasks' && gradeFilter && gradeFilter !== 'all') {
      void args
    }

    const canvas = within(canvasElement)
    const empty = canvasElement.textContent?.includes('No tasks in')
    if (kind === 'allTasks' && empty && gradeFilter && gradeFilter !== 'all') {
      return
    }

    await expect(canvasElement).toBeTruthy()
    const hasContent =
      canvasElement.querySelector('section, h3, code') != null ||
      Boolean(canvasElement.textContent?.trim())
    await expect(hasContent).toBe(true)

    // Cheap MathJax health check — catches red `mjx-merror` / double-wrapped
    // `\(...\)` across the catalog. Skip wait: many sections typeset async;
    // only assert errors that already exist in the DOM.
    if (canvasElement.querySelector('mjx-container, mjx-merror')) {
      assertNoMathJaxErrors(canvasElement)
    }
    void canvas
  }

export const makePlayAllGroupsSmoke = (): PlayFn => catalogSmoke('allGroups')

export const makePlayAllTasksSmoke = (): PlayFn => catalogSmoke('allTasks')
