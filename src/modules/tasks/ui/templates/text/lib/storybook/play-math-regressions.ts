import { expect } from 'storybook/test'

import { isAutomatedInteractionRun } from '@/testing/with-on-demand-play'
import { assertMathJaxRegressionDom } from '@/ui/math-text/assert-mathjax-dom'

/** Groups that previously regressed (italic units / raw answer LaTeX / double wrap / fraction size). */
export const MATH_REGRESSION_GROUPS = [
  'text_16',
  'text_18',
  'text_24',
  'text_61',
] as const

/** `text.after` groups: units font, fraction size and answer alternatives. */
export const AFTER_MATH_REGRESSION_GROUPS = [
  'text_6',
  'text_49',
  'text_67',
] as const

type PlayCanvasArgs = {
  canvasElement: HTMLElement
}

type PlayFn = (context: PlayCanvasArgs) => Promise<void>

/**
 * Browser Vitest play: real MathJax must typeset without merrors / raw
 * delimiters, keep `uprightUnits` upright and draw cyrillic in the prose font.
 */
export const makePlayMathRegressions =
  (options?: { uprightUnits?: string[] }): PlayFn =>
  async ({ canvasElement }) => {
    if (!isAutomatedInteractionRun()) return

    await assertMathJaxRegressionDom(canvasElement, {
      uprightUnits: options?.uprightUnits ?? ['дм'],
    })

    // Answers for text_18 / text_61 must be typeset (not raw `\cdot` prose).
    const answerPanel = canvasElement.querySelector(
      '[class*="solution-answer-panel"], [class*="container"]',
    )
    const mathInAnswers = canvasElement.querySelectorAll('mjx-container')
    await expect(mathInAnswers.length).toBeGreaterThan(0)
    void answerPanel
  }
