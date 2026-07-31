import { describe, expect, it } from 'vitest'

import {
  assertBareLatex,
  hasOuterMathDelimiters,
  stripMathDelimiters,
} from './strip-math-delimiters'

describe('stripMathDelimiters', () => {
  it('strips outer \\(...\\) from API answers', () => {
    expect(stripMathDelimiters('\\(8000\\)')).toBe('8000')
    expect(stripMathDelimiters('\\(4;;3\\)')).toBe('4;;3')
    expect(stripMathDelimiters('\\(\\frac{2}{23}\\)')).toBe('\\frac{2}{23}')
  })

  it('keeps plain strings intact', () => {
    expect(stripMathDelimiters('8000')).toBe('8000')
    expect(stripMathDelimiters('24834 : 12417')).toBe('24834 : 12417')
  })
})

describe('hasOuterMathDelimiters / assertBareLatex', () => {
  it('detects a single outer wrap', () => {
    expect(hasOuterMathDelimiters('\\((y+a)\\cdot 58\\)')).toBe(true)
    expect(hasOuterMathDelimiters('(y+a)\\cdot 58')).toBe(false)
  })

  it('assertBareLatex rejects strings meant for MathFormula', () => {
    expect(() => assertBareLatex('\\(3\\)', 'correctAnswer')).toThrow(
      /MathFormula/,
    )
    expect(assertBareLatex('(y+a)\\cdot 58')).toBe('(y+a)\\cdot 58')
  })
})
