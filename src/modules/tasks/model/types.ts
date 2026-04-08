import type { RefObject } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
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

export type MathInputRefType = RefObject<Map<string, MathInputRef> | null>
