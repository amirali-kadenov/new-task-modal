import { useState } from 'react'

import { isApiError } from '../../lib/is-api-error'
import {
  useAppState,
  useSetAppState,
  useStore,
} from '../../store/task-modal-store'
import type { TaskModalProps } from '../../types/props'
import type { TaskModalRefs } from '../layout/use-refs'

import { useShowNextTask } from './use-show-next-task'

interface Args {
  props: TaskModalProps
  refs: TaskModalRefs
}

declare global {
  interface Window {
    FlutterJS: {
      postMessage: (message: string) => void
    }
  }
}

export const useCheckAnswer = ({ props, refs }: Args) => {
  const {
    activeTask,
    tasks,
    lockVersion,
    characterTexts,
    selectedCharacter,
    correctTextIndex,
    incorrecTextIndex,
    userProgress,
  } = useAppState()

  const setState = useSetAppState()
  const setAnswer = useStore((s) => s.setAnswer)
  const setPrevAnswer = useStore((s) => s.setPrevAnswer)

  const [isLoading, setIsLoading] = useState(false)

  const showNextTask = useShowNextTask({ props: props })

  const resetValues = () => {
    setAnswer('')
    setPrevAnswer(null)
    refs.mathInput.current?.clear()
  }

  const checkAnswer = async () => {
    let answer = useStore.getState().answer
    const { deps, hostProps } = props
    const { enums, api, global, helpers, alert, lodash, localize } = deps
    const {
      CheckUserAnswerResult,
      UserActionResult,
      TaskDescriptionType,
      HttpStatusCode,
    } = enums

    try {
      setIsLoading(true)

      if (!activeTask || !tasks) {
        return
      }

      // Fire-and-forget: doesn't block the answer check
      if (userProgress > 90) {
        api
          .getExistsFreezingToday()
          .then((res) => {
            if (res.existsToday) {
              alert.showErrorMessage(localize.personalStudyPage.inFreezing)
              window.FlutterJS.postMessage('{"done": false, "type": "close"}')
            }
          })
          .catch((error) => {
            alert.showError(error)
            window.FlutterJS.postMessage('{"done": false, "type": "close"}')
          })
      }

      if (typeof answer === 'string') {
        answer = helpers.CyrillicTo.default_numeral(answer)
      }

      // const isLengthMoreThan255 = isString && answer.length > 255

      // if (isLengthMoreThan255) {
      //   toast({
      //     deps,
      //     type: 'error',
      //     selectedCharacter,
      //     text: localize.maxSymbol,
      //   })

      //   return
      // }

      const response = await api.checkAnswer(
        { ...activeTask, answer, lockVersion },
        hostProps.lessonId,
        global.getLanguage(),
      )

      const handleCorrectAnswer = async () => {
        const correctTextDivider = selectedCharacter
          ? characterTexts.yourAnswerIsCorrect.length
          : 10

        const newCorrectIndex = (correctTextIndex + 1) % correctTextDivider

        // toast({
        //   deps,
        //   type: 'success',
        //   selectedCharacter,
        //   text: characterTexts.yourAnswerIsCorrect[newCorrectIndex],
        // })
        /* TODO: add notification */

        global.saveLastAnswer(answer)

        const updatedActiveTask = {
          ...activeTask,
          result: UserActionResult.Correct,
          answer: answer,
          isAnswerChanged: true,
        }

        const updatedTasks = tasks.map((it) =>
          it.id === activeTask.id ? updatedActiveTask : it,
        )

        setState({
          activeTask: updatedActiveTask,
          tasks: updatedTasks,
          errorMessage: '',
          userProgress: response.userProgress,
          checkUserAnswerResult: response.result,
          selectedIndexes: [],
          lockVersion: response.lockVersion,
          correctTextIndex: newCorrectIndex,
        })

        resetValues()

        await showNextTask(response.userProgress)
      }

      const handleIncorrectAnswer = () => {
        // console.log('Answer is incorrect, response', response)
        // console.log('Response details:', {
        //   solution: response.solution,
        //   hint1: response.hint1,
        //   hint2: response.hint2,
        //   attemptsCount: response.attemptsCount,
        //   penaltyTasks: response.penaltyTasks?.length || 0,
        //   newTasks: response.newTasks?.length || 0,
        // })

        const isGiveAttempt =
          response.result === CheckUserAnswerResult.GiveAttempt

        const updatedActiveTask = {
          ...activeTask,
          solution: response.solution,
          hint1: isGiveAttempt
            ? response.hint1 || activeTask.hint1 || undefined
            : undefined,
          hint2: isGiveAttempt
            ? response.hint2 || activeTask.hint2 || undefined
            : undefined,
          result: isGiveAttempt
            ? UserActionResult.None
            : UserActionResult.Error,
          attemptsCount: response.attemptsCount,
          isAnswerChanged: false,
          answer:
            (activeTask.description.type as string) ===
            TaskDescriptionType.CalculateByImage
              ? undefined
              : answer,
          selectedIndexes: [],
          clearSelectedIndexes: true,
        }

        const notCorrectTextDivider = selectedCharacter
          ? characterTexts.yourAnswerIsNotCorrect.length
          : 10

        const newIncorrectIndex =
          (incorrecTextIndex + 1) % notCorrectTextDivider

        // toast({
        //   deps,
        //   type: 'error',
        //   selectedCharacter,
        //   text: characterTexts.yourAnswerIsNotCorrect[newIncorrectIndex],
        // })

        const activeTaskOrItsPenaltyPositionIndex = lodash.findLastIndex(
          tasks,
          (it) => it.position === activeTask.position,
        )

        const updatedTasks = tasks.map((it) =>
          it.id === activeTask.id ? updatedActiveTask : it,
        )

        const insertIndex = activeTaskOrItsPenaltyPositionIndex + 1

        const resolvedTasks = [
          ...updatedTasks.slice(0, insertIndex),
          ...response.penaltyTasks,
          ...updatedTasks.slice(insertIndex),
          ...(response.newTasks ?? []),
        ]

        setPrevAnswer(answer)

        setState({
          activeTask: updatedActiveTask,
          tasks: resolvedTasks,
          errorMessage: '',
          checkUserAnswerResult: response.result,
          selectedIndexes: [],
          incorrecTextIndex: newIncorrectIndex,
        })
      }

      const isCorrect = response.result === CheckUserAnswerResult.ShowCorrect

      if (isCorrect) {
        await handleCorrectAnswer()
      } else {
        handleIncorrectAnswer()
      }
    } catch (error) {
      if (!isApiError(error)) {
        alert.showError(error)
        return
      }

      alert.showError(error)

      const isConflict = error.response.status === HttpStatusCode.Conflict

      if (isConflict) {
        setState({ lockVersionConflict: true })
      } else {
        const isInternalServerError =
          error.response?.status === HttpStatusCode.InternalServerError

        if (isInternalServerError) {
          await showNextTask(userProgress)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    checkAnswer,
    resetValues,
    isLoading,
  }
}

// type ToastArgs = {
//   type: 'error' | 'success'
//   deps: TaskModalDependencies
//   text: string
//   selectedCharacter: string | null
// }

// const toast = ({ deps, type, text, selectedCharacter }: ToastArgs) => {
//   deps.toast[type](deps.global.translate(text), {
//     className: clsx(
//       selectedCharacter && `my-toast toast-icon-${selectedCharacter}`,
//     ),
//     bodyClassName: clsx(selectedCharacter && 'my-toast-body'),
//     progressClassName: clsx(selectedCharacter && 'my-toast-progress-bar'),
//     autoClose: 2500,
//     closeButton: false,
//   })
// }
