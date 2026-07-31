import type { Translation } from '@/types/api/task'

/**
 * Backend solution for `text` tasks
 * (`TextTaskSolution` / `TaskSolutionType.text`).
 *
 * Single-input: `{ type: 'text', answer: Translation, content: Translation }`.
 * Multi-input tasks put all values into `answer` joined by the
 * multiple-answer separator.
 *
 * Example payload: `./data/solution.json`
 */
export interface TextTaskSolution {
  type: 'text'
  answer: Translation
  content: Translation
}
