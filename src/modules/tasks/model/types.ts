import type { RefObject } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import type { TaskSolutionValue } from '@/modules/tasks/lib/solution-types'
import type { Task } from '@/types/api/task'
import type { TaskDescriptionType } from '@/types/enums'
import type { MathInputRef } from '@/ui/math-input/types'

export interface TaskComponentProps<T extends TaskDescriptionType = 'text'> {
  task: Task<T>
  deps: TaskModalDependencies
  answer: string
  onChange: (answer: string) => void
  mathInput: MathInputRefType
}

/** Same shape as TaskComponentProps; renders template UI with correct answer values. */
export interface TaskSolutionComponentProps<
  T extends TaskDescriptionType = 'text',
> {
  task: Task<T>
  deps: TaskModalDependencies
  answer: string
  solution: TaskSolutionValue
}

export type MathInputRefType = RefObject<Map<string, MathInputRef> | null>
