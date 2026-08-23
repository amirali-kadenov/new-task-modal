import {
  getCorrectAnswerFromSolution,
  type TaskSolutionValue,
} from '@/modules/tasks/lib/solution-types'
import type { Translation } from '@/types/api/task'

import type { TestTaskDescription } from './types.task'

/**
 * Correct answer letter (A/B/C…) for a test-template task.
 * `solution.answer` (and, inside it, a MultipleChoice solution part's
 * flagged variant) is authoritative; `description.correctAnswer` is the
 * fallback for tasks where the CMS never populated solution text.
 */
export const getTestCorrectValue = (
  description: Pick<TestTaskDescription, 'correctAnswer'>,
  solution: TaskSolutionValue,
  translate?: (value: Translation | string) => string,
): string =>
  getCorrectAnswerFromSolution(solution, translate) ||
  (description.correctAnswer ? String(description.correctAnswer) : '')
