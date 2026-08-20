import type { MathInputRef } from '@/ui/math-input/types'

import type { MathInputRefType } from '../model/types'

/**
 * Callers with a stable per-field `id` (multi-input templates via `bindRef`)
 * key the map by that id on both mount and unmount. Callers without one
 * (single-`MathInput` templates) fall back to a fixed key — MathInput's own
 * `.id` is otherwise a fresh `useId()` on every remount, so without this
 * fallback the unmount branch (called with `ref: null`, no `id` to key off)
 * can never find and delete the old entry, leaking it in the map forever.
 * A later `inputMap.size > 1` check then mistakes the task for multi-input.
 */
const DEFAULT_KEY = 'default'

export const setMathInputRef = (
  ref: MathInputRef | null,
  mathInputRef: MathInputRefType,
  id?: string,
) => {
  const key = id ?? DEFAULT_KEY

  if (!ref) {
    mathInputRef.current?.delete(key)
    return
  }

  let map = mathInputRef?.current

  if (!map) {
    map = new Map<string, MathInputRef>()
    mathInputRef.current = map
  }

  map.set(key, ref)
}
