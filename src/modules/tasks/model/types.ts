import type { RefObject } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import type { TaskSolutionValue } from '@/modules/tasks/lib/solution-types'
import type { Task } from '@/types/api/task'
import type { MathInputRef } from '@/ui/math-input/types'

/**
 * `T` is the full per-template task shape (e.g. `ComplexTask`, `TableTask`
 * from each template's local `lib/types.task.ts`), not a `TaskDescriptionType`
 * literal — every template passes its own task interface here directly.
 */
export interface TaskComponentProps<T = Task<'text'>> {
  task: T
  deps: TaskModalDependencies
  answer: string
  onChange: (answer: string) => void
  mathInput: MathInputRefType
}

/** Same shape as TaskComponentProps; renders template UI with correct answer values. */
export interface TaskSolutionComponentProps<T = Task<'text'>> {
  task: T
  deps: TaskModalDependencies
  answer: string
  solution: TaskSolutionValue
}

export type MathInputRefType = RefObject<Map<string, MathInputRef> | null>
