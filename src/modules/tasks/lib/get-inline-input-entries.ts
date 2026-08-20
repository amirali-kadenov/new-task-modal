import type { Task } from '@/types/api/task'

export interface InlineInputConfig {
  key: string
  before?: string
  after?: string
}

/** answerInput с input1, input2, … для inline-задач (text / answerCell / columnOperation). */
export const getInlineInputEntries = (
  task: Task,
  translate: (text: string) => string,
): InlineInputConfig[] => {
  const answerInput = task.answerInput as Record<string, unknown> | undefined
  if (!answerInput) return []

  return Object.entries(answerInput)
    .filter(([key]) => key.startsWith('input'))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, raw]) => {
      const config = raw as {
        before?: string | { rus?: string }
        after?: string | { rus?: string }
      }

      const before =
        typeof config.before === 'string'
          ? translate(config.before)
          : config.before?.rus
            ? translate(config.before.rus)
            : ''

      const after =
        typeof config.after === 'string'
          ? translate(config.after)
          : config.after?.rus
            ? translate(config.after.rus)
            : ''

      return { key, before, after }
    })
}

export const hasInlineAnswerInput = (task: Task): boolean => {
  const answerInput = task.answerInput as Record<string, unknown> | undefined
  return (
    Boolean(answerInput?.inline) ||
    getInlineInputEntries(task, (s) => s).length > 0
  )
}
