import clsx from 'clsx'
import React from 'react'

import type { TaskModalProps } from '@/modules/task-modal/model/types/props'

import { useAppState } from '../../model/store/task-modal-store'

interface Props {
  taskModalProps: TaskModalProps
  onSelected?: (id: string) => void
  style?: React.CSSProperties
  dotListRef?: React.RefObject<HTMLDivElement>
}

export const TaskModalDotList: React.FC<Props> = ({
  taskModalProps,
  onSelected,
  style,
  dotListRef,
}) => {
  const state = useAppState()
  const { deps } = taskModalProps
  const { activeTask, tasks } = state
  const { helpers, enums } = deps
  const { ArabicNumeralUtils } = helpers
  const { UserActionResult } = enums

  const handleSelected = (id: string) => () => {
    if (onSelected) {
      onSelected(id)
    }
  }

  const isArabic = ArabicNumeralUtils.isArabic()
  const direction = ArabicNumeralUtils.getDirection()

  return (
    <div
      id="task-modal-dot-list"
      className="dot-list"
      style={style}
      dir={direction}
      ref={dotListRef}
    >
      {tasks?.map((it) => (
        <button
          key={it.id}
          id={`dot-${it.id}`}
          className={clsx(
            'dot',
            it.id === activeTask.id && 'dot-active',
            (it.answer || it.result === UserActionResult.Answered) &&
              'dot-answered',
            isArabic && it.isPenalty && 'dot-penalty-arab',
            !isArabic && it.isPenalty && 'dot-penalty',
            it.result === UserActionResult.SolutionShown && 'dot-show-solution',
            it.result === UserActionResult.VideoExplanationShown &&
              'dot-show-video-explanation',
            it.result === UserActionResult.Error && 'dot-error',
            it.result === UserActionResult.Correct && 'dot-success',
          )}
          style={{ cursor: onSelected ? 'pointer' : 'default' }}
          onClick={handleSelected(it.id)}
        />
      ))}
    </div>
  )
}
