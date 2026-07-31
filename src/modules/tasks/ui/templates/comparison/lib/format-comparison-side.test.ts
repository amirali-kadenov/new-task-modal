import { describe, expect, it } from 'vitest'

import { formatComparisonSide } from './format-comparison-side'

const identity = (value: string) => value

describe('formatComparisonSide', () => {
  it('numbers stay plain', () => {
    expect(formatComparisonSide(30000, identity)).toBe('30000')
  })

  it('wraps units in math islands with mathrm', () => {
    expect(formatComparisonSide('3 \\(см^3\\)', identity)).toBe(
      '3 \\(\\mathrm{см}^{3}\\)',
    )
    expect(formatComparisonSide('3000 \\(мм^3\\)', identity)).toBe(
      '3000 \\(\\mathrm{мм}^{3}\\)',
    )
  })

  it('plain sides without islands unchanged', () => {
    expect(formatComparisonSide('82 см', identity)).toBe('82 см')
  })
})
