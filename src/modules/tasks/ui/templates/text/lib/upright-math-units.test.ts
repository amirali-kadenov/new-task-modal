import { describe, expect, it } from 'vitest'

import { uprightMathUnits, uprightUnitsInTex } from './upright-math-units'

describe('uprightUnitsInTex', () => {
  it('wraps unit with power', () => {
    expect(uprightUnitsInTex('см^2')).toBe('\\mathrm{см}^{2}')
    expect(uprightUnitsInTex('мм^2')).toBe('\\mathrm{мм}^{2}')
    expect(uprightUnitsInTex('м^2')).toBe('\\mathrm{м}^{2}')
    expect(uprightUnitsInTex('дм^3')).toBe('\\mathrm{дм}^{3}')
  })

  it('wraps bare unit without power', () => {
    expect(uprightUnitsInTex('мм')).toBe('\\mathrm{мм}')
    expect(uprightUnitsInTex('км/ч')).toBe('\\mathrm{км/ч}')
    expect(uprightUnitsInTex('дм')).toBe('\\mathrm{дм}')
  })

  it('does not carve units out of longer cyrillic words', () => {
    expect(uprightUnitsInTex('млн')).toBe('млн')
    expect(uprightUnitsInTex('38 \\ млн \\ км^2')).toBe(
      '38 \\ млн \\ \\mathrm{км}^{2}',
    )
  })

  it('uprights дм in mixed volume expressions (text_16)', () => {
    expect(uprightUnitsInTex('6 м^3 : 2000 дм^3 = ')).toBe(
      '6 \\mathrm{м}^{3} : 2000 \\mathrm{дм}^{3} = ',
    )
  })

  it('leaves TeX commands and percent alone', () => {
    expect(uprightUnitsInTex('\\dfrac{65}{100}')).toBe('\\dfrac{65}{100}')
    expect(uprightUnitsInTex('\\%')).toBe('\\%')
  })

  it('leaves single-letter latin variables alone', () => {
    expect(uprightUnitsInTex('b')).toBe('b')
    expect(uprightUnitsInTex('z')).toBe('z')
    expect(uprightUnitsInTex('n')).toBe('n')
  })

  it('does not double-wrap existing mathrm', () => {
    expect(uprightUnitsInTex('\\mathrm{см}^{2}')).toBe('\\mathrm{см}^{2}')
    expect(uprightUnitsInTex('\\mathrm{мм}')).toBe('\\mathrm{мм}')
  })
})

describe('uprightMathUnits', () => {
  it('uprights units inside math islands only', () => {
    expect(uprightMathUnits('2 \\(см^2\\) = ')).toBe(
      '2 \\(\\mathrm{см}^{2}\\) = ',
    )
    expect(uprightMathUnits('83500 \\(мм^2\\) = ')).toBe(
      '83500 \\(\\mathrm{мм}^{2}\\) = ',
    )
  })

  it('keeps variables italic-ready inside islands', () => {
    expect(uprightMathUnits('собрали \\(z\\) кг')).toBe('собрали \\(z\\) кг')
  })

  it('is idempotent', () => {
    const once = uprightMathUnits('2 \\(см^2\\) = ')
    expect(uprightMathUnits(once)).toBe(once)
  })
})
