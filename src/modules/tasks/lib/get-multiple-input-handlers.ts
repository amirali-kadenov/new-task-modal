import type { MathInputRef } from '@/ui/math-input/types'

import type { MathInputRefType } from '../model/types'

import { joinMultiAnswer } from './multi-answer'
import { setMathInputRef } from './set-math-input-ref'

type Args = {
  onChange: (answer: string) => void
  separator: string
  mathInput: MathInputRefType
  /** When set, always emit this many slots (empty string for missing fields). */
  inputCount?: number
}

const inputIdSortKey = (id: string): [number, string] => {
  const num = Number(/(\d+)$/.exec(id)?.[1])
  return [Number.isNaN(num) ? Number.POSITIVE_INFINITY : num, id]
}

const trailingNumber = (id: string): number | null => {
  const num = Number(/(\d+)$/.exec(id)?.[1])
  return Number.isNaN(num) ? null : num
}

/** 1-based ids like `input1`; 0-based like `table-input-0`. */
const slotForId = (id: string, oneBased: boolean): number | null => {
  const num = trailingNumber(id)
  if (num == null) return null
  return oneBased ? num - 1 : num
}

/**
 * Collect latex values in stable slot order. Pads holes so a transiently
 * missing `input1` while typing in `input2` does not shift `input2` into slot 0.
 */
export const collectMultiInputValues = (
  inputMap: Map<string, MathInputRef>,
  inputCount?: number,
): string[] => {
  const entries = [...inputMap.entries()].sort(([a], [b]) => {
    const [numA, idA] = inputIdSortKey(a)
    const [numB, idB] = inputIdSortKey(b)
    if (numA !== numB) return numA - numB
    return idA.localeCompare(idB)
  })

  const nums = entries
    .map(([id]) => trailingNumber(id))
    .filter((n): n is number => n != null)

  if (nums.length === 0) {
    return entries.map(([, item]) => item.getLatex())
  }

  const oneBased = Math.min(...nums) >= 1
  const maxNum = Math.max(...nums)
  const count = Math.max(inputCount ?? 0, oneBased ? maxNum : maxNum + 1)
  const values = Array.from({ length: count }, () => '')

  for (const [id, item] of entries) {
    const slot = slotForId(id, oneBased)
    if (slot == null || slot < 0 || slot >= count) continue
    values[slot] = item.getLatex()
  }

  return values
}

/** Stable per-id bindRef callbacks for a given mathInput ref object. */
const bindRefCacheByMathInput = new WeakMap<
  object,
  Map<string, (ref: MathInputRef | null) => void>
>()

export const getMultipleInputHandlers = ({
  onChange,
  separator,
  mathInput,
  inputCount,
}: Args) => {
  const setRef = (ref: MathInputRef | null) => setMathInputRef(ref, mathInput)

  let bindCache = bindRefCacheByMathInput.get(mathInput)
  if (!bindCache) {
    bindCache = new Map()
    bindRefCacheByMathInput.set(mathInput, bindCache)
  }

  /** Prefer this when the field has a stable id so unmount can delete the map entry. */
  const bindRef = (id: string) => {
    let cb = bindCache.get(id)
    if (!cb) {
      cb = (ref: MathInputRef | null) => setMathInputRef(ref, mathInput, id)
      bindCache.set(id, cb)
    }
    return cb
  }

  const handleChange = () => {
    const inputMap = mathInput.current
    if (!inputMap) return

    onChange(
      joinMultiAnswer(collectMultiInputValues(inputMap, inputCount), separator),
    )
  }

  return {
    setRef,
    bindRef,
    handleChange,
  }
}
