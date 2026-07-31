/**
 * task.answerInput → templateId for comparison tasks.
 */

export type ComparisonAdornment = 'plain' | 'before' | 'after' | 'beforeAfter'

interface ClassifiableTask {
  answerInput?: unknown
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

const adornmentOf = (before: unknown, after: unknown): ComparisonAdornment => {
  const hasBefore = hasText(before)
  const hasAfter = hasText(after)
  if (hasBefore && hasAfter) return 'beforeAfter'
  if (hasBefore) return 'before'
  if (hasAfter) return 'after'
  return 'plain'
}

const isMultiAnswerInput = (ai: Record<string, unknown>): boolean =>
  'inline' in ai || Object.keys(ai).some((key) => key.startsWith('input'))

/**
 * Known catalog (grade 4): `comparison.plain` only.
 * Classifier still supports adornment/multi shapes for future grades.
 */
export const classifyComparisonTemplate = (
  task: ClassifiableTask,
): string => {
  const ai = task.answerInput

  if (ai == null || typeof ai !== 'object') return 'comparison.plain'

  const record = ai as Record<string, unknown>

  if (isMultiAnswerInput(record)) {
    const inputs = Object.entries(record)
      .filter(([key]) => key.startsWith('input'))
      .map(([, value]) => value as Record<string, unknown> | undefined)

    const layout = record.inline ? 'inline' : 'stack'
    const anyBefore = inputs.some((input) => hasText(input?.before))
    const anyAfter = inputs.some((input) => hasText(input?.after))
    const adorn = adornmentOf(anyBefore ? 'x' : '', anyAfter ? 'x' : '')

    return `comparison.multi.${layout}.n${inputs.length}.${adorn}`
  }

  return `comparison.${adornmentOf(record.before, record.after)}`
}
