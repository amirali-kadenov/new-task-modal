import type { MathInputRef } from '@/ui/math-input/types'

import type { MathInputRefType } from '../model/types'

export const setMathInputRef = (
  ref: MathInputRef | null,
  mathInputRef: MathInputRefType,
) => {
  if (!ref) {
    return
  }

  let map = mathInputRef?.current

  if (!map) {
    map = new Map<string, MathInputRef>()
    mathInputRef.current = map
  }

  map.set(ref.id, ref)
}
