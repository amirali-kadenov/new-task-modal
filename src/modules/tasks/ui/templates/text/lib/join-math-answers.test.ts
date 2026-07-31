import { describe, expect, it } from 'vitest'

import { joinMathAnswers } from './join-math-answers'
import { hasOuterMathDelimiters } from './strip-math-delimiters'

describe('joinMathAnswers', () => {
  it('оборачивает каждое значение в \\(...\\) и склеивает через ;', () => {
    expect(joinMathAnswers(['\\frac{3}{19}', '\\frac{5}{19}'])).toBe(
      '\\(\\frac{3}{19}\\) ; \\(\\frac{5}{19}\\)',
    )
  })

  it('не дублирует делимитеры, если они уже есть', () => {
    expect(joinMathAnswers(['\\(\\frac{3}{19}\\)', '\\(\\frac{5}{19}\\)'])).toBe(
      '\\(\\frac{3}{19}\\) ; \\(\\frac{5}{19}\\)',
    )
  })

  it('пропускает пустые значения', () => {
    expect(joinMathAnswers(['1', '', '  ', '2'])).toBe('\\(1\\) ; \\(2\\)')
  })

  it('output is for MathText (already delimited), not bare MathFormula input', () => {
    const joined = joinMathAnswers(['(y+a)\\cdot 58'])
    expect(joined).toBe('\\((y+a)\\cdot 58\\)')
    expect(hasOuterMathDelimiters(joined)).toBe(true)
  })
})
