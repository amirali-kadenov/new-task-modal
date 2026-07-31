/* eslint-disable react-hooks/static-components */
import clsx from 'clsx'
import { Suspense, type RefObject } from 'react'

import { ErrorBoundary } from '@/lib/error-boundary/error-boundary'
import {
  useAppState,
  useStore,
} from '@/modules/task-modal/model/store/task-modal-store'
import { useTaskComponent } from '@/modules/tasks/model/component/use-task-component'
import type { TaskComponentProps } from '@/modules/tasks/model/types'

import type { TaskModalProps } from '../../../model/types/props'

import { LegacyTaskRoot } from '@/modules/task-modal/ui/legacy-task-root'

import { TaskHints } from '../task-hints/task-hints'

import { ContainerSkeleton } from './container-skeleton'
import s from './container.module.scss'

interface Props {
  props: TaskModalProps
  isAdjusting: boolean
  taskProps: Omit<TaskComponentProps, 'task' | 'state' | 'deps' | 'answer'>
  ref: RefObject<HTMLDivElement | null>
}

export const TaskModalContainer = ({
  props,
  isAdjusting,
  taskProps,
  ref,
}: Props) => {
  const answer = useStore((s) => s.answer)
  const { activeTask } = useAppState()
  const { deps } = props

  const TaskComponent = useTaskComponent({
    activeTask,
  })

  const availableTasks = useStore((s) => s.availableTasks)

  const isAzerbaijan = deps.global.isLanguageAzerbaijanSelected()

  const dir = deps.helpers.ArabicNumeralUtils.getDirection()

  const isTaskSupported = (() => {
    if (!activeTask) return true
    try {
      const key = activeTask.type.replace('Elixir.Task_', '')
      return Boolean(availableTasks?.[key])
    } catch (e) {
      return true
    }
  })()

  return (
    <ErrorBoundary>
      <Suspense fallback={<ContainerSkeleton />}>
        {isAdjusting && <ContainerSkeleton />}

        <div
          className={clsx(
            s.container,
            isAzerbaijan && s.azerbaijani,
            isAdjusting && s.adjusting,
          )}
          ref={ref}
          dir={dir}
        >
          {!isTaskSupported && props.renderLegacyTask ? (
            <LegacyTaskRoot props={props} />
          ) : (
            <>
              <TaskComponent
                {...taskProps}
                answer={answer}
                deps={deps}
                task={activeTask}
              />
              <TaskHints />
            </>
          )}
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}
