import { describe, expect, it } from 'vitest'

import {
  formatSolutionAnswer,
  getCorrectAnswerFromSolution,
} from './solution-types'

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

describe('formatSolutionAnswer locale fallback', () => {
  const translation = (rus: string, kaz = '') => ({
    rus,
    kaz,
    eng: '',
    module_name: 'Elixir.Helpers.Translation',
  })

  it('uses translate when it returns a non-empty string', () => {
    expect(
      formatSolutionAnswer(translation('8;;67', ''), () => 'from-locale'),
    ).toBe('from-locale')
  })

  it('falls back to rus when translate returns empty (kaz-only locale)', () => {
    expect(formatSolutionAnswer(translation('8;;67', ''), () => '')).toBe(
      '8;;67',
    )
  })

  it('reads rus without module_name (live API shape)', () => {
    expect(
      formatSolutionAnswer({ rus: '8;;67', kaz: '' } as never, () => ''),
    ).toBe('8;;67')
  })
})
