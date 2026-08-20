import type { Translation } from '@/types/api/task'

/** Mirrors backend FigureType for solution.parts */
export const SolutionFigureType = {
  Text: 10,
  NumberLine: 20,
  MultipleChoice: 180,
  CoordinatePlane: 110,
  Table: 120,
  Html: 170,
} as const

export interface SolutionMultipleChoiceVariant {
  text?: Translation | string
  correct?: boolean
  isCorrect?: boolean
  image?: string
}

export interface SolutionTableRow {
  cells: (Translation | string)[]
  colspan_list?: number[]
  rowspan_list?: number[]
}

export interface ComplexSolutionPart {
  type: number
  content?: Translation | string
  center?: boolean
  variants?: SolutionMultipleChoiceVariant[]
  rows?: SolutionTableRow[]
  width?: string
  tableAlign?: string
  /** CoordinatePlane (type 110) fields — mirrors ComplexCoordinatePlanePart. */
  [key: string]: unknown
}

export interface TaskSolutionObject {
  answer?: string | Translation
  content?: Translation | string
  type?: string
  parts?: ComplexSolutionPart[]
  error?: Translation | string
}

export const isTranslationObject = (value: unknown): value is Translation => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'module_name' in value &&
    typeof (value as Translation).module_name === 'string'
  )
}

/** Prefer current-locale translate, then any non-empty language field (ME often fills only `rus`). */
const translationAnswerText = (
  answer: Translation,
  translate?: (value: Translation | string) => string,
): string => {
  const translated = translate?.(answer)
  if (translated != null && translated.trim()) return translated
  return (
    answer.rus ||
    answer.kaz ||
    answer.eng ||
    answer.uzb ||
    answer.aze ||
    answer.kgz ||
    answer.school ||
    ''
  )
}

export const formatSolutionAnswer = (
  answer: string | Translation | undefined | null,
  translate?: (value: Translation | string) => string,
): string => {
  if (answer == null) return ''

  if (typeof answer === 'string') {
    return isPlaceholderAnswer(answer) ? '' : answer
  }

  // Match Global.translate (`_.isObject`) — do not require `module_name`.
  if (typeof answer === 'object' && !Array.isArray(answer)) {
    const text = translationAnswerText(answer, translate)
    return isPlaceholderAnswer(text) ? '' : text
  }

  return ''
}

export type TaskSolutionValue = TaskSolutionObject | string | null | undefined

export const isPlaceholderAnswer = (
  value: string | undefined | null,
): boolean => {
  if (!value) return true
  const trimmed = value.trim()
  return trimmed === '' || trimmed === '()' || trimmed === '\\(\\)'
}

export const isActiveSolution = (
  solution: TaskSolutionValue,
): solution is Exclude<TaskSolutionValue, null | undefined> => {
  if (solution == null || solution === '-') return false
  if (typeof solution === 'string') return solution.trim().length > 0
  if (typeof solution === 'object' && 'error' in solution && solution.error) {
    return true
  }
  return typeof solution === 'object'
}

export const isComplexSolution = (
  solution: TaskSolutionValue,
): solution is TaskSolutionObject & { parts: ComplexSolutionPart[] } => {
  return (
    typeof solution === 'object' &&
    solution !== null &&
    solution.type === 'complex' &&
    Array.isArray(solution.parts)
  )
}

export const isFormulaStringSolution = (
  solution: TaskSolutionValue,
): solution is string => {
  return typeof solution === 'string' && solution.trim().length > 0
}

const ANSWER_ALTERNATIVES_SEPARATOR = '||'

/**
 * CMS stores equivalent accepted answers separated by `||`.
 * Solution UI shows the primary (first) representation only.
 */
const pickPrimaryAnswer = (value: string): string =>
  value.split(ANSWER_ALTERNATIVES_SEPARATOR, 1)[0].trim()

export const getCorrectAnswerFromSolution = (
  solution: TaskSolutionValue,
  translate?: (value: Translation | string) => string,
): string => {
  if (typeof solution === 'string') return ''
  if (typeof solution !== 'object' || solution === null) return ''

  const answerText = formatSolutionAnswer(solution.answer, translate)
  if (answerText) return pickPrimaryAnswer(answerText)

  if (isComplexSolution(solution)) {
    const mcPart = solution.parts.find(
      (part) => part.type === SolutionFigureType.MultipleChoice,
    )
    if (mcPart?.variants) {
      const index = mcPart.variants.findIndex(
        (variant) => variant.isCorrect || variant.correct,
      )
      if (index >= 0) {
        return String.fromCharCode(65 + index)
      }
    }
  }

  return ''
}

export const resolveSolutionValue = (
  taskSolution: TaskSolutionValue | undefined,
): TaskSolutionValue => taskSolution ?? null
