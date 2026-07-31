import { describe, expect, it } from 'vitest'

import { getCorrectAnswerFromSolution } from './solution-types'

describe('getCorrectAnswerFromSolution alternatives', () => {
  const solution = (answer: string) => ({ type: 'text', answer })

  it('keeps the first equivalent answer and trims it (text_67)', () => {
    expect(
      getCorrectAnswerFromSolution(solution('  a : 6 || \\frac{a}{6}  ')),
    ).toBe('a : 6')
  })

  it('leaves an answer without alternatives unchanged except outer spaces', () => {
    expect(getCorrectAnswerFromSolution(solution('  481  '))).toBe('481')
  })

  it('preserves the field count before multi-answer splitting', () => {
    expect(
      getCorrectAnswerFromSolution(solution('2;;9 || 3;;8')).split(';;'),
    ).toEqual(['2', '9'])
  })
})
