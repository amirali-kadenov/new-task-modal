import { describe, expect, it } from 'vitest'

import {
  maybeNormalizeBareMath,
  normalizeBareMath,
} from './normalize-bare-math'

describe('normalizeBareMath', () => {
  it('no-op without caret', () => {
    expect(normalizeBareMath('просто текст')).toBe('просто текст')
  })

  it('wraps bare units like text_6 description', () => {
    expect(normalizeBareMath('9 см^2 - 62 мм^2 = ')).toBe(
      '9 \\(\\mathrm{см}^{2}\\) - 62 \\(\\mathrm{мм}^{2}\\) = ',
    )
  })

  it('wraps bare after suffix', () => {
    expect(normalizeBareMath('мм^2')).toBe('\\(\\mathrm{мм}^{2}\\)')
    expect(normalizeBareMath('^2')).toBe('\\(^2\\)')
  })

  it('does not double-wrap existing delimiters (text_7 style)', () => {
    expect(normalizeBareMath('2 \\(см^2\\) = ')).toBe('2 \\(см^2\\) = ')
    expect(normalizeBareMath('\\(мм^2\\)')).toBe('\\(мм^2\\)')
  })

  it('maybeNormalizeBareMath respects flag', () => {
    expect(maybeNormalizeBareMath('см^2', false)).toBe('см^2')
    expect(maybeNormalizeBareMath('см^2', true)).toBe('\\(\\mathrm{см}^{2}\\)')
  })
})
