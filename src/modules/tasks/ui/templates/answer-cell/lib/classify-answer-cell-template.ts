/**
 * task.answerInput → templateId for answerCell tasks.
 */

export type AnswerCellAdornment = 'plain' | 'before' | 'after' | 'beforeAfter'

interface ClassifiableTask {
  answerInput?: unknown
  description?: { content?: unknown }
  fields?: unknown
}

/**
 * A stack/n2/plain answerCell is normally an arithmetic expression
 * (`"answercell + answercell"`, `"620 + answercell = 861"`). Number-sequence
 * tasks share the same answerInput shape but their `content` is a
 * semicolon-delimited list of literal numbers with no arithmetic operator
 * (`"28; 33; answercell; answercell; 48; 53; 58; 63; 68"`) — those get
 * fixed-width cells instead of the arithmetic default's stretching ones.
 */
const isSequenceContent = (content: unknown): boolean => {
  if (typeof content !== 'string') return false
  if (/[+\-·×÷=]/.test(content)) return false
  return content.split(';').length >= 4
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

const adornmentOf = (before: unknown, after: unknown): AnswerCellAdornment => {
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
 * Known catalog: `answerCell.plain`, `answerCell.after`,
 * `answerCell.multi.inline.n2.plain`, `answerCell.multi.stack.n2.plain`,
 * `answerCell.multi.stack.n2.sequence`.
 */
export const classifyAnswerCellTemplate = (task: ClassifiableTask): string => {
  const ai = task.answerInput

  if (ai == null || typeof ai !== 'object') return 'answerCell.plain'

  const record = ai as Record<string, unknown>

  if (isMultiAnswerInput(record)) {
    const inputs = Object.entries(record)
      .filter(([key]) => key.startsWith('input'))
      .map(([, value]) => value as Record<string, unknown> | undefined)

    const layout = record.inline ? 'inline' : 'stack'
    const anyBefore = inputs.some((input) => hasText(input?.before))
    const anyAfter = inputs.some((input) => hasText(input?.after))
    const adorn = adornmentOf(anyBefore ? 'x' : '', anyAfter ? 'x' : '')

    if (
      layout === 'stack' &&
      inputs.length === 2 &&
      adorn === 'plain' &&
      isSequenceContent(task.description?.content)
    ) {
      return 'answerCell.multi.stack.n2.sequence'
    }

    return `answerCell.multi.${layout}.n${inputs.length}.${adorn}`
  }

  return `answerCell.${adornmentOf(record.before, record.after)}`
}
