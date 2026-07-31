import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import { uprightMathUnits } from '@/modules/tasks/ui/templates/text/lib/upright-math-units'
import type { Translation } from '@/types/api/task'

import type { ComparisonSide } from './types.task'

/** Format a comparison side (number | string | Translation) for MathText. */
export const formatComparisonSide = (
  side: ComparisonSide | null | undefined,
  translate: (value: Translation | string) => string,
): string => {
  if (side == null) return ''

  let raw = ''
  if (typeof side === 'number') raw = String(side)
  else if (typeof side === 'string') raw = side
  else if (isTranslation(side)) raw = translate(side)

  // `3 \(см^3\)` → `3 \(\mathrm{см}^{3}\)` so units stay upright in MathJax.
  return uprightMathUnits(raw)
}
