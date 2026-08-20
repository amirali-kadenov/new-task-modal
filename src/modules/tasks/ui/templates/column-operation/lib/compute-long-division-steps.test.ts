import { describe, expect, it } from 'vitest'

import {
  computeLongDivisionSteps,
  renderBringDown,
} from './compute-long-division-steps'

describe('computeLongDivisionSteps', () => {
  it('exact division, single-digit divisor: 938 / 2', () => {
    const result = computeLongDivisionSteps(938, 2)
    expect(result.quotient).toBe(469)
    expect(result.remainder).toBe(0)
    expect(result.steps).toHaveLength(3)
  })

  it('division with nonzero remainder carried mid-sequence: 983 / 3', () => {
    const result = computeLongDivisionSteps(983, 3)
    expect(result.quotient).toBe(327)
    expect(result.remainder).toBe(2)
    // middle step's remainder (2) flows into the next step's current (23)
    expect(result.steps[1].remainder).toBe(2)
    expect(result.steps[1].hasZeroRemainder).toBe(false)
    expect(result.steps[2].current).toBe(23)
  })

  it('multi-digit divisor: 8395 / 357', () => {
    const result = computeLongDivisionSteps(8395, 357)
    expect(result.quotient).toBe(23)
    expect(result.remainder).toBe(184)
    // first step spans the 3 leading digits (8,3,9) needed to reach >= 357
    expect(result.steps[0]).toMatchObject({
      columnStart: 0,
      width: 3,
      current: 839,
      quotientDigit: 2,
      subtrahend: 714,
      remainder: 125,
      showBringDown: false,
    })
    expect(result.steps[1]).toMatchObject({
      columnStart: 3,
      width: 1,
      current: 1255,
      quotientDigit: 3,
      subtrahend: 1071,
      remainder: 184,
      showBringDown: true,
    })
  })

  it('production case (lessonId 2105): 86809 / 2', () => {
    const result = computeLongDivisionSteps(86809, 2)
    expect(result.quotient).toBe(43404)
    expect(result.remainder).toBe(1)
    expect(result.steps).toEqual([
      {
        columnStart: 0,
        width: 1,
        current: 8,
        quotientDigit: 4,
        subtrahend: 8,
        remainder: 0,
        hasZeroRemainder: true,
        showBringDown: false,
      },
      {
        columnStart: 1,
        width: 1,
        current: 6,
        quotientDigit: 3,
        subtrahend: 6,
        remainder: 0,
        hasZeroRemainder: true,
        showBringDown: true,
      },
      {
        columnStart: 2,
        width: 1,
        current: 8,
        quotientDigit: 4,
        subtrahend: 8,
        remainder: 0,
        hasZeroRemainder: true,
        showBringDown: true,
      },
      {
        columnStart: 3,
        width: 1,
        current: 0,
        quotientDigit: 0,
        subtrahend: 0,
        remainder: 0,
        hasZeroRemainder: true,
        showBringDown: true,
      },
      {
        columnStart: 4,
        width: 1,
        current: 9,
        quotientDigit: 4,
        subtrahend: 8,
        remainder: 1,
        hasZeroRemainder: false,
        showBringDown: true,
      },
    ])
    // matches the real production bring-down rows: "06", "08", "00", "09"
    expect(renderBringDown(result.steps, 1)).toBe('06')
    expect(renderBringDown(result.steps, 2)).toBe('08')
    expect(renderBringDown(result.steps, 3)).toBe('00')
    expect(renderBringDown(result.steps, 4)).toBe('09')
  })

  it('exact division with internal zero digits: 90000 / 2', () => {
    const result = computeLongDivisionSteps(90000, 2)
    expect(result.quotient).toBe(45000)
    expect(result.remainder).toBe(0)
    expect(result.steps).toHaveLength(5)
    // first digit (9/2) leaves remainder 1; every digit after that divides evenly
    expect(result.steps[0].hasZeroRemainder).toBe(false)
    expect(result.steps.slice(1).every((step) => step.hasZeroRemainder)).toBe(
      true,
    )
  })

  it('dividend entirely smaller than divisor: 3 / 7', () => {
    const result = computeLongDivisionSteps(3, 7)
    expect(result.steps).toEqual([])
    expect(result.quotient).toBe(0)
    expect(result.remainder).toBe(3)
  })

  it('dividend is zero', () => {
    const result = computeLongDivisionSteps(0, 5)
    expect(result.steps).toEqual([])
    expect(result.quotient).toBe(0)
    expect(result.remainder).toBe(0)
  })

  it('throws on invalid divisor', () => {
    expect(() => computeLongDivisionSteps(10, 0)).toThrow()
    expect(() => computeLongDivisionSteps(10, -1)).toThrow()
  })

  it('throws on invalid dividend', () => {
    expect(() => computeLongDivisionSteps(-1, 2)).toThrow()
    expect(() => computeLongDivisionSteps(1.5, 2)).toThrow()
  })
})

describe('renderBringDown', () => {
  it('does not prepend a cosmetic zero when the previous remainder was nonzero', () => {
    const result = computeLongDivisionSteps(983, 3)
    // steps[1].remainder === 2 (nonzero), so steps[2]'s bring-down has no cosmetic zero
    expect(result.steps[1].hasZeroRemainder).toBe(false)
    expect(renderBringDown(result.steps, 2)).toBe(
      String(result.steps[2].current),
    )
  })

  it('prepends a cosmetic zero when the previous remainder was exactly 0', () => {
    const result = computeLongDivisionSteps(983, 3)
    // steps[0].remainder === 0, so steps[1]'s bring-down gets a leading "0"
    expect(result.steps[0].hasZeroRemainder).toBe(true)
    expect(renderBringDown(result.steps, 1)).toBe(`0${result.steps[1].current}`)
  })
})
