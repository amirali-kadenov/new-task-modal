/**
 * task.answerInput → templateId. Single source of truth for routing
 * text tasks to a concrete template.
 *
 * Mirrored (in plain JS) by stats server `templatesTable` builder —
 * keep the two in sync when changing rules.
 */

export type TextAdornment = 'plain' | 'before' | 'after' | 'beforeAfter'

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

const adornmentOf = (before: unknown, after: unknown): TextAdornment => {
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
 * Returns the templateId candidate built from the answerInput shape.
 * May return an id outside the known catalog (e.g. `text.multi.stack.n6.after`
 * for future data) — resolve through the registry, which falls back safely.
 */
export const classifyTextTemplate = (task: ClassifiableTask): string => {
  const ai = task.answerInput

  if (ai == null || typeof ai !== 'object') return 'text.plain'

  if (isTranslationValue(ai)) return 'text.aiTranslation'

  const record = ai as Record<string, unknown>

  if (isMultiAnswerInput(record)) {
    const inputs = Object.entries(record)
      .filter(([key]) => key.startsWith('input'))
      .map(([, value]) => value as Record<string, unknown> | undefined)

    const layout = record.inline ? 'inline' : 'stack'
    const anyBefore = inputs.some((input) => hasText(input?.before))
    const anyAfter = inputs.some((input) => hasText(input?.after))
    const adorn = adornmentOf(anyBefore ? 'x' : '', anyAfter ? 'x' : '')

    return `text.multi.${layout}.n${inputs.length}.${adorn}`
  }

  return `text.${adornmentOf(record.before, record.after)}`
}
