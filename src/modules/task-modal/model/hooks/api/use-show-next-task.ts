import {
  useAppState,
  useSetAppState,
  useStore,
} from '../../store/task-modal-store'
import type { TaskModalProps } from '../../types/props'

import { useCheckTaskSupport } from './use-check-task'

interface Args {
  props: TaskModalProps
}

export const useShowNextTask = ({ props }: Args) => {
  const state = useAppState()
  const setState = useSetAppState()

  const setIsTransitioning = useStore((s) => s.setIsTransitioning)

  const checkIfSupported = useCheckTaskSupport(props)

  const { deps, hostProps } = props
  const { enums, socketController, socket, api } = deps
  const { TaskSourceType, SocketCommand } = enums
  const { personalStudyItemId, selfWorkId, isTesting } = hostProps

  const showNextTask = async (progress?: number) => {
    const { tasks, activeTask } = state

    if (!tasks || !activeTask) {
      return
    }

    try {
      setIsTransitioning(true)

      const nextTaskIndex = tasks.findIndex((it) => it.id === activeTask.id) + 1

      const isLast = nextTaskIndex === tasks.length

      if (isLast) {
        if (progress) {
          setState({ userProgress: progress })
        }
        props.closeModal()
        return
      }

      const nextTask = tasks[nextTaskIndex]

      if (!checkIfSupported(nextTask)) {
        return
      }

      const sourceType = personalStudyItemId
        ? TaskSourceType.PersonalStudy
        : selfWorkId
          ? TaskSourceType.SelfWork
          : TaskSourceType.Regular

      if (!isTesting) {
        await api.setPupilActiveTask({
          ...nextTask,
          sourceType,
          description: null,
          title: null,
        })
      }

      setState({ activeTask: nextTask })

      socketController.push(
        socket,
        socketController.currentPupilRoom(),
        SocketCommand.NewActiveTask,
        {
          ...nextTask,
          sourceType,
        },
      )
    } finally {
      setIsTransitioning(false)
    }
  }

  return showNextTask
}
