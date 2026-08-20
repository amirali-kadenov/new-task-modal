/**
 * Pure long-division "bring-down" simulation for the school «уголок» worked
 * example. Verified digit-for-digit against a real production render
 * (86809 ÷ 2 → steps rendered as "06/6", "08/8", "00/0", "09/8"): once the
 * first quotient digit is produced, EVERY remaining dividend digit gets its
 * own step, even when that step's quotient digit is 0 — there is no
 * "skip small partial dividends" optimization once the quotient has started.
 */

export interface LongDivisionStep {
  /** 0-based index of the leftmost dividend digit this step's `current` covers. */
  columnStart: number
  /** Number of dividend-digit columns `current` spans (>1 only for the first step). */
  width: number
  /** Partial dividend being divided at this step. */
  current: number
  /** `Math.floor(current / divisor)` — may be 0. */
  quotientDigit: number
  /** `quotientDigit * divisor`. */
  subtrahend: number
  /** `current - subtrahend`. */
  remainder: number
  /** Drives the cosmetic leading zero on the *next* step's bring-down digit. */
  hasZeroRemainder: boolean
  /** False only for the first step — its `current` is already the dividend's own leading digits, no separate bring-down row. */
  showBringDown: boolean
}

export interface LongDivisionResult {
  steps: LongDivisionStep[]
  quotient: number
  remainder: number
}

/**
 * Computes the step sequence for `dividend ÷ divisor`. Assumes valid input
 * (non-negative/positive safe integers) — callers with untrusted/CMS-derived
 * values should validate first (see `parse-division-corner-numbers.ts`) and
 * skip calling this rather than relying on it to fail gracefully.
 */
export const computeLongDivisionSteps = (
  dividend: number,
  divisor: number,
): LongDivisionResult => {
  if (!Number.isSafeInteger(dividend) || dividend < 0) {
    throw new Error(
      `computeLongDivisionSteps: dividend must be a non-negative safe integer, got ${dividend}`,
    )
  }
  if (!Number.isSafeInteger(divisor) || divisor <= 0) {
    throw new Error(
      `computeLongDivisionSteps: divisor must be a positive safe integer, got ${divisor}`,
    )
  }

  const digits = String(dividend).split('').map(Number)

  const steps: LongDivisionStep[] = []
  const quotientDigits: number[] = []
  let current = 0
  let windowStart = 0

  digits.forEach((digit, i) => {
    current = current * 10 + digit

    if (quotientDigits.length === 0 && current < divisor) {
      return
    }

    const quotientDigit = Math.floor(current / divisor)
    const subtrahend = quotientDigit * divisor
    const remainder = current - subtrahend

    steps.push({
      columnStart: windowStart,
      width: i - windowStart + 1,
      current,
      quotientDigit,
      subtrahend,
      remainder,
      hasZeroRemainder: remainder === 0,
      showBringDown: steps.length > 0,
    })

    quotientDigits.push(quotientDigit)
    current = remainder
    windowStart = i + 1
  })

  const quotient = quotientDigits.length ? Number(quotientDigits.join('')) : 0
  const remainder = steps.length ? steps[steps.length - 1].remainder : dividend

  return { steps, quotient, remainder }
}

/**
 * Rendered bring-down text for `steps[index]`, including the cosmetic
 * leading zero when the previous step's remainder was exactly 0 (school
 * convention: explicitly write the "0" carried down before the new digit).
 */
export const renderBringDown = (
  steps: LongDivisionStep[],
  index: number,
): string => {
  const previous = steps[index - 1]
  const prefix = previous?.hasZeroRemainder ? '0' : ''
  return prefix + String(steps[index].current)
}
