import type { DivisionCornerParts } from './parse-division-corner'

export interface DivisionCornerNumbers {
  dividend: number
  divisor: number
}

/**
 * Converts `parseDivisionCorner`'s string parts to integers for
 * `computeLongDivisionSteps`. `null` when they aren't safely parseable —
 * the CMS shape isn't guaranteed to always be plain digits.
 */
export const toDivisionCornerNumbers = (
  parts: Pick<DivisionCornerParts, 'dividend' | 'divisor'>,
): DivisionCornerNumbers | null => {
  const dividend = Number(parts.dividend.replace(/\s+/g, ''))
  const divisor = Number(parts.divisor.replace(/\s+/g, ''))

  if (
    !Number.isSafeInteger(dividend) ||
    !Number.isSafeInteger(divisor) ||
    dividend < 0 ||
    divisor <= 0
  ) {
    return null
  }

  return { dividend, divisor }
}
