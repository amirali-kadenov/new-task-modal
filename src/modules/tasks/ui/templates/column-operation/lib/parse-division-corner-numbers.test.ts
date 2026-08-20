import { describe, expect, it } from 'vitest'

import { toDivisionCornerNumbers } from './parse-division-corner-numbers'

describe('toDivisionCornerNumbers', () => {
  it('parses plain digit strings', () => {
    expect(
      toDivisionCornerNumbers({ dividend: '86809', divisor: '2' }),
    ).toEqual({
      dividend: 86809,
      divisor: 2,
    })
  })

  it('tolerates internal/surrounding whitespace', () => {
    expect(
      toDivisionCornerNumbers({ dividend: ' 8395 ', divisor: '3 57' }),
    ).toEqual({ dividend: 8395, divisor: 357 })
  })

  it('returns null for non-numeric dividend', () => {
    expect(
      toDivisionCornerNumbers({ dividend: '\\phantom{9}', divisor: '2' }),
    ).toBeNull()
  })

  it('returns null for non-numeric divisor', () => {
    expect(
      toDivisionCornerNumbers({ dividend: '100', divisor: 'x' }),
    ).toBeNull()
  })

  it('returns null for divisor <= 0', () => {
    expect(
      toDivisionCornerNumbers({ dividend: '100', divisor: '0' }),
    ).toBeNull()
    expect(
      toDivisionCornerNumbers({ dividend: '100', divisor: '-5' }),
    ).toBeNull()
  })

  it('returns null for negative dividend', () => {
    expect(
      toDivisionCornerNumbers({ dividend: '-100', divisor: '5' }),
    ).toBeNull()
  })
})
