import { describe, expect, it } from 'vitest'

import { normalizeFractionStyle } from './normalize-fraction-style'

describe('normalizeFractionStyle', () => {
  it('no-op without frac', () => {
    expect(
      normalizeFractionStyle('Чему равна \\(\\dfrac{1}{7}\\) часть?'),
    ).toBe('Чему равна \\(\\dfrac{1}{7}\\) часть?')
  })

  it('expands frac to dfrac inside math islands (text_70 → prose size)', () => {
    expect(
      normalizeFractionStyle(
        'что составляет \\(\\frac{1}{7}\\) часть всех коробок',
      ),
    ).toBe('что составляет \\(\\dfrac{1}{7}\\) часть всех коробок')
  })

  it('leaves already-dfrac islands alone (text_24)', () => {
    expect(
      normalizeFractionStyle('Чему равна \\(\\dfrac{1}{5}\\) часть числа 150?'),
    ).toBe('Чему равна \\(\\dfrac{1}{5}\\) часть числа 150?')
  })

  it('leaves prose outside islands alone', () => {
    expect(normalizeFractionStyle('\\frac outside')).toBe('\\frac outside')
  })

  it('is idempotent', () => {
    const once = normalizeFractionStyle(
      'У какого числа \\(\\frac{2}{5}\\) части будет 82?',
    )
    expect(once).toBe('У какого числа \\(\\dfrac{2}{5}\\) части будет 82?')
    expect(normalizeFractionStyle(once)).toBe(once)
  })
})
