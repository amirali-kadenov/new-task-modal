import { useEffect } from 'react'

import type { Global } from '@/types/global'

import {
  useAppState,
  useSetAppState,
  useStore,
} from '../../store/task-modal-store'
import type { TaskModalProps } from '../../types/props'

import { useCheckTaskSupport } from './use-check-task'

interface Props {
  props: TaskModalProps
}

const canUseDotNavigation = (isSaving: boolean, global: Global) => {
  if (isSaving) return false

  const adminIds = [1631456, 1631459, 1631461, 1631464, 1631465]
  return global.isTestUser() || adminIds.includes(global.getUserId())
}

export const useOnModalDotSelected = ({ props }: Props) => {
  const { tasks, activeTask, isSaving } = useAppState()
  const isAnswerChanged = useStore((s) => s.isAnswerChanged)
  const setIsAnswerChanged = useStore((s) => s.setIsAnswerChanged)
  const setAnswer = useStore((s) => s.setAnswer)
  const setState = useSetAppState()

  const checkIfSupported = useCheckTaskSupport(props)

  const onModalDotSelected = async (newTaskId: string) => {
    const { deps, hostProps } = props
    const { api, alert, socketController, socket, enums } = deps
    const { SocketCommand, TaskSourceType } = enums
    const { personalStudyItemId, selfWorkId } = hostProps

    const newActiveTask = tasks?.find((it) => it.id === newTaskId)

    if (!tasks || !newActiveTask) {
      return
    }

    if (!checkIfSupported(newActiveTask)) {
      return
    }

    try {
      setState({ isSaving: true })

      if (isAnswerChanged) {
        await api.saveControlWorkTaskUserAnswer(
          activeTask.id,
          activeTask.answer,
        )

        setState({
          tasks: tasks.map((it) =>
            it.id === activeTask.id ? { ...it, isAnswerChanged: false } : it,
          ),
          activeTask: newActiveTask,
          isSaving: false,
        })
      } else {
        setState({ activeTask: newActiveTask })
      }

      setIsAnswerChanged(false)
      setAnswer('')

      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('taskIndex', tasks.indexOf(newActiveTask).toString())
      window.history.replaceState(null, '', `?${searchParams.toString()}`)

      const resolvedNewActiveTask = {
        ...newActiveTask,
        sourceType: personalStudyItemId
          ? TaskSourceType.PersonalStudy
          : selfWorkId
            ? TaskSourceType.SelfWork
            : TaskSourceType.Regular,
      }

      socketController.push(
        socket,
        socketController.currentPupilRoom(),
        SocketCommand.NewActiveTask,
        resolvedNewActiveTask,
      )
    } catch (error) {
      alert.showError(error)
    } finally {
      setState({ isSaving: false })
    }
  }

  const handleModalDotSelected = async (newTaskId: string) => {
    if (canUseDotNavigation(isSaving, props.deps.global)) {
      await onModalDotSelected(newTaskId)
    }
  }

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.repeat || !tasks || !activeTask) return

      const currentTaskIndex = tasks.findIndex(
        (task) => task.id === activeTask.id,
      )
      if (currentTaskIndex === -1) return

      if (event.key === 'ArrowLeft' && currentTaskIndex > 0) {
        event.preventDefault()
        const prevTask = tasks[currentTaskIndex - 1]
        await handleModalDotSelected(prevTask.id)
      }

      if (event.key === 'ArrowRight' && currentTaskIndex < tasks.length - 1) {
        event.preventDefault()
        const nextTask = tasks[currentTaskIndex + 1]
        await handleModalDotSelected(nextTask.id)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [tasks?.length, activeTask.id])

  return handleModalDotSelected
}
