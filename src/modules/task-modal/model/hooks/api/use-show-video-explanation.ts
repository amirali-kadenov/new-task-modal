import type { VideoExplanationResponse } from '@/types/api/api'
import type { Task } from '@/types/api/task'

import { isApiError } from '../../lib/is-api-error'
import { useAppState, useSetAppState } from '../../store/task-modal-store'
import type { TaskModalProps } from '../../types/props'

import { useShowNextTask } from './use-show-next-task'

interface Args {
  props: TaskModalProps
}

export const useShowVideoExplanation = ({ props }: Args) => {
  const { tasks, activeTask, lockVersion, userProgress } = useAppState()
  const setState = useSetAppState()

  const showNextTask = useShowNextTask({ props })

  const showVideoExplanation = async (
    onSuccess?: (response: VideoExplanationResponse) => void,
  ) => {
    const { deps } = props
    const { api, global, enums, alert } = deps
    const {
      CheckUserAnswerResult,
      UserActionResult,
      TaskDescriptionType,
      HttpStatusCode,
    } = enums

    if (!activeTask || !tasks) {
      return
    }

    setState({
      isShowingVideoExplanation: true,
      isVideoButtonClicked: true,
    })

    try {
      const response = await api.getVideoExplanation({
        ...activeTask,
        lockVersion,
        language: global.isLocationQalanSchool()
          ? 'school'
          : global.getAbbreviatedLanguage(),
      })
      // console.log('video explanaiton response', { response })
      setState({ lockVersion: response.lockVersion })

      const updatedActiveTask: Task = {
        ...activeTask,
        videoId: response.videoId,
        videoUrl: response.videoUrl,
        videoUrlAsTranslation: response.videoUrlAsTranslation,
        solution: response.solution,
        result:
          response.result === CheckUserAnswerResult.ShowSolution
            ? UserActionResult.Error
            : UserActionResult.None,
        attemptsCount: Math.max(
          activeTask.attemptsCount ?? 0,
          response.attemptsCount,
        ),
        selectedIndexes: [],
        answer:
          (activeTask.description?.type as string) ===
          TaskDescriptionType.CalculateByImage
            ? null
            : activeTask.answer,
        clearSelectedIndexes: true,
        locatedCountry: response.locatedCountry,
      }

      const activeTaskOrItsPenaltyPositionIndex = findLastIndex(
        tasks,
        (it) => it.position === activeTask.position,
      )

      const updatedTasks = tasks.map((it) =>
        it.id === activeTask.id ? updatedActiveTask : it,
      )

      const insertionIndex = activeTaskOrItsPenaltyPositionIndex + 1

      const resolvedTasks = [
        ...updatedTasks.slice(0, insertionIndex),
        ...response.penaltyTasks,
        ...updatedTasks.slice(insertionIndex),
        ...(response.newTasks || []),
      ]

      setState({
        activeTask: updatedActiveTask,
        isShowingVideoExplanation: false,
        errorMessage: '',
        checkUserAnswerResult: response.result,
        tasks: resolvedTasks,
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
          isShowingVideoExplanation: false,
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
          isShowingVideoExplanation: false,
          errorMessage: '',
        })
      }
    }
  }

  return showVideoExplanation
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
