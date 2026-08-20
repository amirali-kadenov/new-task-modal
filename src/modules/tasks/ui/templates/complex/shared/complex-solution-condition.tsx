import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import type { TaskSolutionValue } from '@/modules/tasks/lib/solution-types'
import type { Translation } from '@/types/api/task'

import { getComplexTableSolutionAnswers } from '../lib/get-complex-table-solution-answers'
import type { ComplexTaskDescription } from '../lib/types.task'

import { ComplexDescription } from './complex-description'

interface Props {
  description: ComplexTaskDescription
  deps: TaskModalDependencies
  solution: TaskSolutionValue
  separator: string
  translate: (value: Translation | string) => string
  /** complex.after.equation only: centered equation row + input min/max. */
  equationLayout?: boolean
}

/**
 * Single source of truth for a `complex`-type task's condition in solution
 * mode (parts + table-answercell fill-in). Used identically by the
 * task-modal solution (`complex-solution.tsx`) and the AI-chat solution
 * (`chat-solution-view.tsx`) so neither can drift from the other.
 */
export const ComplexSolutionCondition = ({
  description,
  deps,
  solution,
  separator,
  translate,
  equationLayout,
}: Props) => {
  const tableSolutionAnswers = getComplexTableSolutionAnswers(
    description?.parts,
    solution,
    separator,
    translate,
  )

  return (
    <ComplexDescription
      description={description}
      deps={deps}
      tableSolutionAnswers={tableSolutionAnswers}
      equationLayout={equationLayout}
    />
  )
}
