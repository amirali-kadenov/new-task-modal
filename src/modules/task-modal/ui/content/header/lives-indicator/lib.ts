import { MAX_LIVES } from '@/modules/task-modal/model/constants'
import type {
  TaskModalProps,
  TaskModalState,
} from '@/modules/task-modal/model/types/props'
import type { Task } from '@/types/api/task'

interface Args {
  activeTask: Task
  tasks: Task[]
}

/**
 * Lives math must read the live `tasks` array from this package's own store
 * (not the legacy host app's state, which is frozen at mount and never sees
 * penalty tasks inserted by this package's own answer-check flow — see
 * `use-check-answer.ts`'s `handleIncorrectAnswer`).
 */
export const getLivesCount = ({ activeTask, tasks }: Args) => {
  if (!activeTask.isPenalty) {
    return MAX_LIVES
  }

  const nextTaskIndex = tasks.findIndex((task) => task.id === activeTask.id) + 1
  const nextTask = tasks[nextTaskIndex]

  /**
   * if it is last penalty task in penalty tasks row (triangles) - 2 lives
   */
  return nextTask?.isPenalty ? 1 : 2
}

export const checkIfLastAttemptSuccessfull = (
  props: TaskModalProps,
  state: TaskModalState,
) => {
  return (
    state.checkUserAnswerResult ===
    props.deps.enums.CheckUserAnswerResult.ShowCorrect
  )
}
