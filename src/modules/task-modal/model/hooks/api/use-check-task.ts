import type { Task } from '@/types/api/task'

import { useAppState, useStore } from '../../store/task-modal-store'
import type { TaskModalProps } from '../../types/props'

export const useCheckTaskSupport = (props: TaskModalProps) => {
  const state = useAppState()
  const availableTasks = useStore((s) => s.availableTasks)

  const isTaskSupported = (task: Task) => {
    const key = task.type.replace('Elixir.Task_', '')
    return availableTasks?.[key]
  }

  const checkIfSupported = (nextTask: Task) => {
    if (isTaskSupported(nextTask)) {
      return true
    } else {
      props.setState(state)
      props.actions.onShowNextTask(state.userProgress)
      return false
    }
  }

  return checkIfSupported
}
