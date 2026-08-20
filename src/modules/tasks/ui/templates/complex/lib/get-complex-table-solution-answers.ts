import { getCorrectMultiAnswerParts } from '@/modules/tasks/lib/get-correct-multi-answer-parts'
import type { TaskSolutionValue } from '@/modules/tasks/lib/solution-types'
import type { Translation } from '@/types/api/task'

import { complexDescriptionHasTableAnswerCells } from '../shared/figures/table-part'

/**
 * `ComplexDescription`'s `tableSolutionAnswers` prop (fills table `answercell`s
 * with the correct value in solution mode). Shared by the task-modal solution
 * (`complex-solution.tsx`) and the AI-chat solution (`chat-solution-view.tsx`)
 * so a `complex`-type condition renders identically on both surfaces.
 */
export const getComplexTableSolutionAnswers = (
  parts:
    | Array<{ type?: number; rows?: Array<{ cells?: unknown[] }> }>
    | undefined,
  solution: TaskSolutionValue,
  separator: string,
  translate: (value: Translation | string) => string,
): string[] | null =>
  complexDescriptionHasTableAnswerCells(parts)
    ? getCorrectMultiAnswerParts(solution, separator, translate)
    : null
