import type { ReactNode } from 'react'

import type { Task } from '@/types/api/task'
import type { TaskDescriptionType } from '@/types/enums'

import type { TaskModalDependencies } from '../../../../task-modal/model/types/props'

import { TaskSolution } from './task-solution'

type Props<
  T extends TaskDescriptionType = 'text',
  S extends typeof TaskSolution = typeof TaskSolution,
> = {
  task: Task<T>
  answer: string
  control: ReactNode
  solutionComponent?: S
  solutionProps?: Record<string, unknown>
  deps: TaskModalDependencies
}

export const TaskSolutionOrControl = <T extends TaskDescriptionType = 'text'>({
  task,
  answer,
  control,
  solutionComponent: SolutionComponent = TaskSolution,
  solutionProps,
  deps,
}: Props<T>) => {
  if (task.solution && task?.solution !== '-') {
    return (
      <SolutionComponent
        solution={task.solution}
        answer={answer}
        correctAnswer={task.solution.answer}
        deps={deps}
        {...solutionProps}
      />
    )
  }

  return control
}
