import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import type { ComplexTaskDescription } from '@/modules/tasks/ui/templates/complex/lib/types.task'
import { ComplexDescription } from '@/modules/tasks/ui/templates/complex/shared/complex-description'
import type { FormulaTask } from '@/modules/tasks/ui/templates/formula/lib/types.task'
import { FormulaDescription } from '@/modules/tasks/ui/templates/formula/shared/formula-description'
import type { Task } from '@/types/api/task'
import type { TaskDescriptionType } from '@/types/enums'

import { TaskDescription } from './task-description'

interface Props<T extends TaskDescriptionType = TaskDescriptionType> {
  task: Task<T>
  deps: TaskModalDependencies
  className?: string
}

/**
 * Shared condition renderer for chat spoiler and container solution views.
 * Composes existing description components — does not own layout/answer UX.
 */
export const SharedSolutionDescription = <T extends TaskDescriptionType>({
  task,
  deps,
  className,
}: Props<T>) => {
  const type = task.description?.type
  const isFormula =
    type === deps.enums.TaskDescriptionType.Formula || type === 'formula'
  const isComplex =
    type === deps.enums.TaskDescriptionType.Complex || type === 'complex'

  if (isFormula) {
    return (
      <FormulaDescription
        task={task as unknown as FormulaTask}
        deps={deps}
        className={className}
      />
    )
  }

  if (isComplex) {
    return (
      <ComplexDescription
        description={task.description as unknown as ComplexTaskDescription}
        deps={deps}
      />
    )
  }

  return <TaskDescription task={task} deps={deps} className={className} />
}
