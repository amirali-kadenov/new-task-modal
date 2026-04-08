import '@/styles/_index.scss'
import clsx from 'clsx'

import { useCalcSetup } from '../../model/hooks/layout/use-calc-setup'
import { useInputFocus } from '../../model/hooks/layout/use-input-focus'
import { useTaskModalRefs } from '../../model/hooks/layout/use-refs'
import { useAppState, useStore } from '../../model/store/task-modal-store'
import type { TaskModalProps } from '../../model/types/props'
import type { TaskModalModals } from '../../task-modal'

import { TaskModalContainer } from './container/container'
import styles from './content.module.scss'
import { TaskModalControls } from './controls/controls'
import { TaskModalHeader } from './header/header'
import { OldProgressBar } from './old-progress-bar'

interface Props {
  props: TaskModalProps
  modals: TaskModalModals
}

export const TaskModalContent = ({ props, modals }: Props) => {
  const { activeTask, tasks } = useAppState()
  const isTransitioning = useStore((s) => s.isTransitioning)
  const setAnswer = useStore((s) => s.setAnswer)
  const setIsAnswerChanged = useStore((s) => s.setIsAnswerChanged)

  const refs = useTaskModalRefs()
  const calcState = useCalcSetup({ refs, activeTask })
  const lastFocusedInput = useInputFocus({ refs, activeTask, calcState })

  const onChange = (value: string) => {
    setAnswer(value)
    setIsAnswerChanged(true)
  }

  const { root, header, mathInput, taskContainer } = refs

  const isAdjusting = isTransitioning || !calcState.isSetupFinished
  // useEffect(() => {
  //   console.log(
  //     `tasks, chapter: ${new URLSearchParams(window.location.search).get('chapterId')}, lesson: ${new URLSearchParams(window.location.search).get('lessonId')}`,
  //     tasks,
  //   )
  // }, [])

  // console.log({
  //   isAdjusting,
  //   isTaskLoaded,
  //   isTransitioning,
  // })
  console.log({ activeTask })
  return (
    <>
      <div ref={root} className={clsx('task-modal', styles.container)}>
        <TaskModalHeader props={props} ref={header} />

        <TaskModalContainer
          props={props}
          ref={taskContainer}
          taskProps={{ onChange, mathInput }}
          isAdjusting={isAdjusting}
        />

        <TaskModalControls
          props={props}
          lastFocusedInput={lastFocusedInput}
          refs={refs}
          calcState={calcState}
          modals={modals}
          isAdjusting={isAdjusting}
        />

        <OldProgressBar modalProps={props} />
      </div>
    </>
  )
}
