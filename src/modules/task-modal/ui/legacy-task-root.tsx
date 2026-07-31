import { useEffect, useRef } from 'react'
import type { Task } from '@/types/api/task'
import type { TaskModalProps } from '../../model/types/props'

type RenderLegacyTask = TaskModalProps['renderLegacyTask']

interface Props {
  props: TaskModalProps
}

export const LegacyTaskRoot = ({ props }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    const renderLegacyTask: RenderLegacyTask | undefined =
      props.renderLegacyTask
    if (!el || !renderLegacyTask) return

    const cleanup = renderLegacyTask(el, props.activeTask, {
      onTaskAnswerChanged: (answer: unknown) => {
        if (props.actions && props.actions.onTaskAnswerChanged)
          props.actions.onTaskAnswerChanged(answer)
      },
      onTaskDescriptionChanged: (desc: unknown) => {
        if (props.actions && props.actions.onTaskDescriptionChanged)
          props.actions.onTaskDescriptionChanged(desc)
      },
    })

    return () => {
      try {
        cleanup && cleanup()
      } catch (e) {
        // ignore
      }
    }
  }, [props.activeTask, props.renderLegacyTask])

  return <div ref={containerRef} className="legacy-task-root" />
}

export default LegacyTaskRoot
