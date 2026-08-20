import type { RefObject } from 'react'

import type { TaskModalProps } from '@/modules/task-modal/model/types/props'
import { TopBar } from '@/ui/top-bar/top-bar'

import s from './header.module.scss'
import { LivesIndicator } from './lives-indicator/lives-indicator'
import { TasksNum } from './tasks-num/tasks-num'

interface Props {
  props: TaskModalProps
  ref: RefObject<HTMLDivElement | null>
}

export const TaskModalHeader = ({ props, ref }: Props) => {
  const { closeModal } = props

  const goBack = () => {
    console.log('goBack')
  }

  return (
    <TopBar
      ref={ref}
      titleClassName={s.title}
      deps={props.deps}
      onClose={closeModal}
      onGoBack={goBack}
    >
      Задача <TasksNum />
      <LivesIndicator props={props} />
    </TopBar>
  )
}
