import type { TaskSolutionResponse } from '@/types/api/api'

import { isApiError } from '../../lib/is-api-error'
import { useAppState, useSetAppState } from '../../store/task-modal-store'
import type { TaskModalProps } from '../../types/props'

import { useShowNextTask } from './use-show-next-task'

interface Args {
  props: TaskModalProps
}

interface ShowSolutionArgs {
  onSuccess?: (response: TaskSolutionResponse) => void
}

export const useShowSolution = ({ props }: Args) => {
  const { tasks, activeTask, lockVersion, userProgress } = useAppState()
  const setState = useSetAppState()

  const showNextTask = useShowNextTask({ props: props })

  const showSolution = async ({ onSuccess }: ShowSolutionArgs) => {
    const { deps, hostProps } = props
    const { api, enums, alert } = deps
    const {
      HttpStatusCode,
      UserActionResult,
      TaskDescriptionType,
      CheckUserAnswerResult,
    } = enums

    try {
      if (!tasks) {
        return
      }

      const response = await api.getTaskSolution(
        { ...activeTask, lockVersion },
        hostProps.lessonId,
      )

      const resolvedAnswer =
        (activeTask?.description?.type as string) ===
        TaskDescriptionType.CalculateByImage
          ? '' // null;
          : activeTask.answer

      const updatedActiveTask = {
        ...activeTask,
        solution: response.solution,
        hint1: '',
        hint2: '',
        result: UserActionResult.SolutionShown,
        answer: resolvedAnswer,
        selectedIndexes: [],
        clearSelectedIndexes: true,
        attemptsCount: 3,
      }

      const activeTaskOrItsPenaltyPositionIndex = findLastIndex(
        tasks,
        (it) => it.position === activeTask.position,
      )

      const insertionIndex = activeTaskOrItsPenaltyPositionIndex + 1

      const updatedTasks = tasks.map((it) =>
        it.id === activeTask.id ? updatedActiveTask : it,
      )

      const resolvedTasks = [
        ...updatedTasks.slice(0, insertionIndex),
        ...response.penaltyTasks,
        ...updatedTasks.slice(insertionIndex),
        ...(response.newTasks || []),
      ]

      setState({
        activeTask: updatedActiveTask,
        tasks: resolvedTasks,
        isShowingSolution: false,
        errorMessage: '',
        checkUserAnswerResult: CheckUserAnswerResult.ShowSolution,
        lockVersion: response.lockVersion,
      })

      onSuccess?.(response)
    } catch (error) {
      alert.showError(error)
      if (
        isApiError(error) &&
        error.response.status === HttpStatusCode.Conflict
      ) {
        setState({
          lockVersionConflict: true,
          isShowingSolution: false,
          errorMessage: '',
        })
      } else {
        if (
          isApiError(error) &&
          error.response.status === HttpStatusCode.InternalServerError
        ) {
          await showNextTask(userProgress)
        }

        setState({
          isShowingSolution: false,
          errorMessage: '',
        })
      }
    }
  }

  return showSolution
}

const findLastIndex = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
): number => {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i, array)) {
      return i
    }
  }
  return -1
}
