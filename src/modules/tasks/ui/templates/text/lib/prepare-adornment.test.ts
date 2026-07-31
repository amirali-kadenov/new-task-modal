import { describe, expect, it } from 'vitest'

import { needsMathTypesetting, prepareAdornment } from './prepare-adornment'

describe('prepareAdornment', () => {
  it('strips math wrappers from prose and marks as plain', () => {
    expect(prepareAdornment('\\(в день\\)')).toEqual({
      kind: 'plain',
      text: 'в день',
    })
    expect(prepareAdornment('\\(рубашек\\)')).toEqual({
      kind: 'plain',
      text: 'рубашек',
    })
  })

  it('keeps math for TeX commands / scripts', () => {
    expect(prepareAdornment('\\(+\\)')).toEqual({
      kind: 'plain',
      text: '+',
    })
    expect(prepareAdornment('\\(мм^2\\)')).toEqual({
      kind: 'math',
      text: '\\(\\mathrm{мм}^{2}\\)',
    })
    expect(prepareAdornment('мм^2')).toEqual({
      kind: 'math',
      text: '\\(\\mathrm{мм}^{2}\\)',
    })
    expect(prepareAdornment('\\(\\frac{1}{2}\\)')).toEqual({
      kind: 'math',
      text: '\\(\\frac{1}{2}\\)',
    })
  })

  it('treats bare prose as plain', () => {
    expect(prepareAdornment('км')).toEqual({ kind: 'plain', text: 'км' })
  })

  it('decodes TeX percent escape to a literal % (text_38)', () => {
    expect(prepareAdornment('\\(\\%\\)')).toEqual({
      kind: 'plain',
      text: '%',
    })
    expect(prepareAdornment('\\%')).toEqual({ kind: 'plain', text: '%' })
  })

  it('keeps mixed math islands for MathText (text.before `\\(x\\) = `)', () => {
    expect(prepareAdornment('\\(x\\) = ')).toEqual({
      kind: 'math',
      text: '\\(x\\) =',
    })
    expect(prepareAdornment('\\(a\\) = ')).toEqual({
      kind: 'math',
      text: '\\(a\\) =',
    })
  })
})

describe('needsMathTypesetting', () => {
  it('detects commands and scripts', () => {
    expect(needsMathTypesetting('+')).toBe(false)
    expect(needsMathTypesetting('\\frac{1}{2}')).toBe(true)
    expect(needsMathTypesetting('мм^2')).toBe(true)
  })
})
