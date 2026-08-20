import { describe, expect, it } from 'vitest'

import { getCorrectMultiAnswerParts } from '@/modules/tasks/lib/get-correct-multi-answer-parts'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'

import { joinMathAnswers } from './join-math-answers'
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

/** Same pipeline as table / multi-complex / chat solution-message. */
describe('API wrapped multi-answer → split parts', () => {
  const wireSep = ';;'

  it('strips outer wrap before ;; split so cells are not broken fragments', () => {
    const fromApi = '\\(8;;3;;5\\)'
    const parts = getCorrectMultiAnswerParts({ answer: fromApi }, wireSep)
    expect(parts).toEqual(['8', '3', '5'])
    expect(joinMathAnswers(parts)).toBe('\\(8\\) ; \\(3\\) ; \\(5\\)')
  })

  it('still works for Storybook-style bare multi answers', () => {
    const fromFixture = '5;;2;;8'
    const parts = getCorrectMultiAnswerParts({ answer: fromFixture }, wireSep)
    expect(parts).toEqual(['5', '2', '8'])
  })

  it('without strip, outer wrap corrupts first/last parts (regression)', () => {
    expect(splitMultiAnswer('\\(8;;3;;5\\)', wireSep)).toEqual([
      '\\(8',
      '3',
      '5\\)',
    ])
  })
})
