import { stripMathDelimiters } from '@/modules/tasks/ui/templates/text/lib/strip-math-delimiters'
import type { Translation } from '@/types/api/task'

import { splitMultiAnswer } from './multi-answer'
import {
  getCorrectAnswerFromSolution,
  type TaskSolutionValue,
} from './solution-types'

/**
 * Correct answer parts for multi-input solution UIs.
 * CMS wraps the whole wire string (`\(8;;3;;5\)`) — strip before `;;` split
 * or cells/panels get broken `\(` / `\)` fragments.
 */
export const getCorrectMultiAnswerParts = (
  solution: TaskSolutionValue,
  separator: string,
  translate?: (value: Translation | string) => string,
): string[] =>
  splitMultiAnswer(
    stripMathDelimiters(getCorrectAnswerFromSolution(solution, translate)),
    separator,
  )
