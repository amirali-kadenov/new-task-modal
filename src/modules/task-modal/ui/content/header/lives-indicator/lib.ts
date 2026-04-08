import type { TaskModalActions } from '@/modules/task-modal/model/types/actions'
import type {
  TaskModalProps,
  TaskModalState,
} from '@/modules/task-modal/model/types/props'
import type { Task } from '@/types/api/task'

interface Args {
  activeTask: Task
  actions: TaskModalActions
}

export const getLivesCount = ({ activeTask, actions }: Args) => {
  let lives = 3

  if (!activeTask.isPenalty) {
    return lives
  }
  // console.log('LIVES COUNT', actions)
  if (actions.isLastPenaltyTaskAtPosition(activeTask)) {
    /**
     * if it is last penalty task in penalty tasks row (triangles) - 2 lives
     */
    lives = 2
  } else {
    lives = 1
  }

  return lives
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
