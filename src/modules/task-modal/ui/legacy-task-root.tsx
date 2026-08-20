import { useEffect, useRef } from 'react'

import { useStore } from '../model/store/task-modal-store'
import type { TaskModalProps } from '../model/types/props'

interface Props {
  props: TaskModalProps
}

export const LegacyTaskRoot = ({ props }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const setAnswer = useStore((s) => s.setAnswer)
  const setIsAnswerChanged = useStore((s) => s.setIsAnswerChanged)
  const taskId = props.activeTask?.id

  useEffect(() => {
    const el = containerRef.current
    const { renderLegacyTask: mountLegacyTask } = props
    if (!el || !mountLegacyTask) return

    const disposeLegacyTask = mountLegacyTask(el, props.activeTask, {
      onTaskAnswerChanged: (answer: unknown) => {
        // Host React state (activeTask.answer)
        if (props.actions?.onTaskAnswerChanged) {
          props.actions.onTaskAnswerChanged(answer)
        }
        // Zustand answer drives the new-modal Check button enablement
        if (typeof answer === 'string') {
          setAnswer(answer)
          setIsAnswerChanged(true)
        } else if (answer != null) {
          const stringAnswer =
            typeof answer === 'number' ||
            typeof answer === 'boolean' ||
            typeof answer === 'bigint'
              ? String(answer)
              : JSON.stringify(answer)
          setAnswer(stringAnswer)
          setIsAnswerChanged(true)
        }
      },
      onTaskDescriptionChanged: (desc: unknown) => {
        if (props.actions?.onTaskDescriptionChanged) {
          props.actions.onTaskDescriptionChanged(desc)
        }
      },
    })

    return () => {
      try {
        if (disposeLegacyTask) disposeLegacyTask()
      } catch {
        // ignore
      }
    }
    // Remount only when the task identity changes — remounting on every
    // answer keystroke recreates MathQuill at left-end and breaks typing order.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: taskId only
  }, [taskId, props.renderLegacyTask, setAnswer, setIsAnswerChanged])

  return <div ref={containerRef} className="legacy-task-root" />
}

export default LegacyTaskRoot
