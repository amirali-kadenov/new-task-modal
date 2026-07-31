import { describe, expect, it } from 'vitest'

import { uprightCyrillicMath } from './render-table-cell-content'

describe('uprightCyrillicMath', () => {
  it('unwraps Cyrillic math to plain text (UI font) and drops LaTeX control spaces', () => {
    expect(uprightCyrillicMath('\\(изд./ч \\ *\\)')).toBe('изд./ч *')
  })

  it('leaves Latin/variable math unchanged', () => {
    expect(uprightCyrillicMath('\\(v\\) = ')).toBe('\\(v\\) = ')
    expect(uprightCyrillicMath('\\(t\\) = ')).toBe('\\(t\\) = ')
  })

  it('leaves plain Cyrillic (no math delimiters) unchanged', () => {
    expect(uprightCyrillicMath('изд./ч')).toBe('изд./ч')
  })

  it('unwraps existing \\text{…} with Cyrillic to plain text', () => {
    expect(uprightCyrillicMath('\\(\\text{изд./ч}\\)')).toBe('изд./ч')
  })
})
