import clsx from 'clsx'
import { useEffect } from 'react'

import Message from '@/assets/icons/actions/message.svg'
import Pen from '@/assets/icons/actions/pen.svg'
import { capitalize } from '@/lib/helpers/capitalize'
import type { TaskModalModals } from '@/modules/task-modal/task-modal'
import { Button, ButtonColor, ButtonLayout } from '@/ui/button/button'
import { ButtonWithLoader } from '@/ui/button/button-with-loader'

import { isAnswerEmpty } from '../../../../model/helpers'
import { useCheckAnswer } from '../../../../model/hooks/api/use-check-answer'
import { useShowNextTask } from '../../../../model/hooks/api/use-show-next-task'
import type { TaskModalRefs } from '../../../../model/hooks/layout/use-refs'
import { useAppState, useStore } from '../../../../model/store/task-modal-store'
import type { TaskModalProps } from '../../../../model/types/props'

import s from './actions.module.scss'

interface Props {
  props: TaskModalProps
  refs: TaskModalRefs
  className?: string
  modals: TaskModalModals
}

export const TaskModalActions = ({ props, refs, className, modals }: Props) => {
  const { deps } = props
  const { activeTask, userProgress } = useAppState()
  const answer = useStore((s) => s.answer)
  const prevAnswer = useStore((s) => s.prevAnswer)
  const isTransitioning = useStore((s) => s.isTransitioning)

  const { checkAnswer, resetValues, isLoading } = useCheckAnswer({
    props,
    refs,
  })
  const showNextTask = useShowNextTask({ props })

  const handleShowNext = async () => {
    resetValues()
    await showNextTask(userProgress)
  }

  useEffect(() => {
    const root = refs.root.current
    if (!root) return

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        await checkAnswer()
      }
    }

    root.addEventListener('keydown', handleKeyDown)
    return () => {
      root.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeTask.id])

  const { actions } = refs
  const translate = deps.global.translate
  const isEmpty = isAnswerEmpty(answer, deps)
  const isAnswerSame = answer === prevAnswer
  const isDisabled = isEmpty || isAnswerSame

  return (
    <div className={clsx(s.container, className)} ref={actions}>
      <Button
        color={ButtonColor.White}
        layout={ButtonLayout.Icon}
        onClick={modals.canvas.open}
        className={clsx(s.button, s.secondary)}
      >
        <Pen />
      </Button>

      <Button
        color={ButtonColor.White}
        layout={ButtonLayout.Icon}
        onClick={modals.chat.open}
        className={clsx(s.button, s.secondary)}
      >
        <Message />
      </Button>

      {activeTask.solution ? (
        <ButtonWithLoader
          onClick={handleShowNext}
          isLoading={isTransitioning}
          className={clsx(s.button, s.primary)}
        >
          {capitalize(translate(deps.localize.next))}
        </ButtonWithLoader>
      ) : (
        <ButtonWithLoader
          onClick={checkAnswer}
          isLoading={isLoading}
          className={clsx(s.button, s.primary)}
          disabled={isDisabled}
        >
          {translate(deps.localize.checkAnswer)}
        </ButtonWithLoader>
      )}
    </div>
  )
}
