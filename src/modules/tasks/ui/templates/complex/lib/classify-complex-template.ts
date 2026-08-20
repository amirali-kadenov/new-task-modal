/**
 * task.answerInput (+ description for equation tables) → templateId.
 */

export type ComplexAdornment = 'plain' | 'before' | 'after' | 'beforeAfter'

interface ClassifiableTask {
  answerInput?: unknown
  description?: {
    isAnswerCellHidden?: boolean
    parts?: Array<{ type?: number; rows?: Array<{ cells?: unknown[] }> }>
  }
}

const isTranslationValue = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && 'module_name' in value

const hasText = (value: unknown): boolean => {
  if (typeof value === 'string') return value.trim().length > 0
  if (isTranslationValue(value)) {
    return Object.entries(value).some(
      ([key, lang]) =>
        key !== 'module_name' &&
        typeof lang === 'string' &&
        lang.trim().length > 0,
    )
  }
  return false
}

const adornmentOf = (before: unknown, after: unknown): ComplexAdornment => {
  const hasBefore = hasText(before)
  const hasAfter = hasText(after)
  if (hasBefore && hasAfter) return 'beforeAfter'
  if (hasBefore) return 'before'
  if (hasAfter) return 'after'
  return 'plain'
}

const isMultiAnswerInput = (ai: Record<string, unknown>): boolean =>
  'inline' in ai || Object.keys(ai).some((key) => key.startsWith('input'))

const hasTableAnswerCell = (
  parts:
    | Array<{ type?: number; rows?: Array<{ cells?: unknown[] }> }>
    | undefined,
): boolean => {
  if (!parts?.length) return false
  return parts.some((part) => {
    if (Number(part.type) !== 120) return false
    return (part.rows ?? []).some((row) =>
      (row.cells ?? []).some((cell) => cell === 'answercell'),
    )
  })
}

/**
 * Known catalog: `complex.plain`, `complex.after`, `complex.after.equation`,
 * `complex.beforeAfter`, `complex.multi.stack.n2.after`,
 * `complex.multi.stack.n2.beforeAfter`.
 */
export const classifyComplexTemplate = (task: ClassifiableTask): string => {
  const ai = task.answerInput

  if (ai == null || typeof ai !== 'object') return 'complex.plain'

  const record = ai as Record<string, unknown>

  if (isMultiAnswerInput(record)) {
    const inputs = Object.entries(record)
      .filter(([key]) => key.startsWith('input'))
      .map(([, value]) => value as Record<string, unknown> | undefined)

    const layout = record.inline ? 'inline' : 'stack'
    const anyBefore = inputs.some((input) => hasText(input?.before))
    const anyAfter = inputs.some((input) => hasText(input?.after))
    const adorn = adornmentOf(anyBefore ? 'x' : '', anyAfter ? 'x' : '')

    return `complex.multi.${layout}.n${inputs.length}.${adorn}`
  }

  const adorn = adornmentOf(record.before, record.after)
  if (
    adorn === 'after' &&
    Boolean(task.description?.isAnswerCellHidden) &&
    hasTableAnswerCell(task.description?.parts)
  ) {
    return 'complex.after.equation'
  }

  return `complex.${adorn}`
}
