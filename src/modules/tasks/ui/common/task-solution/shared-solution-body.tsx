import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import type {
  ComplexSolutionPart,
  TaskSolutionValue,
} from '@/modules/tasks/lib/solution-types'

import { ComplexSolutionParts } from './complex-solution-parts'
import { SolutionExplanation } from './solution-explanation'

interface Props {
  solution: TaskSolutionValue
  deps: TaskModalDependencies
  /** Skip the whole explanation body (both structured `parts` and free-text/
   * formula-string content) — the caller already renders an authoritative
   * replacement (e.g. computed long-division steps). */
  suppressFreeTextContent?: boolean
}

const getSolutionParts = (
  solution: TaskSolutionValue,
): ComplexSolutionPart[] | null => {
  if (
    solution &&
    typeof solution === 'object' &&
    'parts' in solution &&
    Array.isArray(solution.parts) &&
    solution.parts.length > 0
  ) {
    return solution.parts
  }
  return null
}

/**
 * Shared explanation body for container solution views and AI-chat spoiler.
 * Same branch as complex-solution: non-empty parts → ComplexSolutionParts,
 * else → SolutionExplanation (text content / formula string).
 */
export const SharedSolutionBody = ({
  solution,
  deps,
  suppressFreeTextContent,
}: Props) => {
  if (suppressFreeTextContent) return null

  const solutionParts = getSolutionParts(solution)

  if (solutionParts) {
    return <ComplexSolutionParts parts={solutionParts} deps={deps} />
  }

  return <SolutionExplanation solution={solution} deps={deps} />
}
