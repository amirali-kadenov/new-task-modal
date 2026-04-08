import { useMemo } from 'react'

import type { Task } from '@/types/api/task'

import { getTaskComponent } from './get-task-component'

interface Args {
  activeTask: Task | null
}

export const useTaskComponent = ({ activeTask }: Args) => {
  const TaskComponent = useMemo(() => {
    const component = getTaskComponent(activeTask)

    if (!component) return NilComponent

    return component
  }, [activeTask])

  return TaskComponent
}

const NilComponent = () => null
