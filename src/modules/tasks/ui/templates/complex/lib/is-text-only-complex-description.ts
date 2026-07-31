import { FigureType } from './figure-types'
import { normalizeComplexPart } from './normalize-complex-part'
import type { ComplexTaskDescription } from './types.task'

/** True when every description part is Text (type 10) — expression can sit beside input. */
export const isTextOnlyComplexDescription = (
  description: ComplexTaskDescription | undefined | null,
): boolean => {
  const parts = description?.parts
  if (!parts?.length) return false

  return parts.every((raw) => {
    const part = normalizeComplexPart(
      raw as unknown as Record<string, unknown>,
    )
    return Number(part.type) === FigureType.Text
  })
}
