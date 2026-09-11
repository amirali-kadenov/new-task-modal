import { describe, expect, it } from 'vitest'

import { inputWidthHint } from './input-width-hint'

describe('inputWidthHint', () => {
  it('returns null when the task carries no numbers', () => {
    expect(inputWidthHint({ fields: { difficulty: 'x1' } }, 24)).toBeNull()
    expect(inputWidthHint({}, 24)).toBeNull()
  })

  it('grows with the longest number in the task', () => {
    const small = inputWidthHint({ fields: { number1: 7 } }, 24)
    const large = inputWidthHint({ fields: { number1: 7, number2: 30303 } }, 24)
    expect(small).not.toBeNull()
    expect(large).not.toBeNull()
    expect(large!).toBeGreaterThan(small!)
  })

  it('reads numeric strings as numbers', () => {
    expect(inputWidthHint({ fields: { a: '12345' } }, 24)).toBe(
      inputWidthHint({ fields: { a: 12345 } }, 24),
    )
  })

  it('stays within the field size limits', () => {
    expect(inputWidthHint({ fields: { a: 1 } }, 24)).toBeGreaterThanOrEqual(72)
    expect(
      inputWidthHint({ fields: { a: '1'.repeat(200) } }, 24),
    ).toBeLessThanOrEqual(560)
  })
})
