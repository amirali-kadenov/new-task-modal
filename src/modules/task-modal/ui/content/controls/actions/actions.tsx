import clsx from 'clsx'
import { useEffect } from 'react'

import Message from '@/assets/icons/actions/message.svg'
import Pen from '@/assets/icons/actions/pen.svg'
import { capitalize } from '@/lib/helpers/capitalize'
import type { TaskModalModals } from '@/modules/task-modal/task-modal'
import { getLivesCount } from '@/modules/task-modal/ui/content/header/lives-indicator/lib'
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
  const { activeTask, tasks, userProgress } = useAppState()
  const answer = useStore((s) => s.answer)
  const prevAnswer = useStore((s) => s.prevAnswer)

  const { checkAnswer, resetValues, isLoading } = useCheckAnswer({
    props,
    refs,
  })
  const showNextTask = useShowNextTask({ props })

  const handleShowNext = async () => {
    resetValues()
    await showNextTask(userProgress)
  }

  const isEmpty = isAnswerEmpty(answer, deps)
  const isAnswerSame = answer === prevAnswer
  const isDisabled = isEmpty || isAnswerSame

  // Same "lives left" math the hearts indicator uses — `activeTask.solution`
  // isn't a reliable signal here, the backend doesn't always populate it in
  // the same response that exhausts `attemptsCount` (or at all, e.g. viewing
  // the theory example with lives still remaining).
  const showNext =
    (activeTask.attemptsCount ?? 0) >=
    getLivesCount({ activeTask, tasks: tasks ?? [] })

  useEffect(() => {
    const root = refs.root.current
    if (!root) return

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return
      e.preventDefault()

      if (isDisabled) return

      await checkAnswer()
    }

    root.addEventListener('keydown', handleKeyDown)
    return () => {
      root.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeTask.id, isDisabled])

  const { actions } = refs
  const translate = deps.global.translate

  return (
    <div className={clsx(s.container, className)} ref={actions}>
      <Button
        color={ButtonColor.White}
        layout={ButtonLayout.Icon}
        onClick={modals.canvas.open}
        aria-label="Открыть доску"
        className={clsx(s.button, s.secondary)}
      >
        <Pen />
      </Button>

      <Button
        color={ButtonColor.White}
        layout={ButtonLayout.Icon}
        onClick={modals.chat.open}
        aria-label="Открыть чат"
        className={clsx(s.button, s.secondary)}
      >
        <Message />
      </Button>

      {showNext ? (
        <ButtonWithLoader
          onClick={handleShowNext}
          isLoading={false}
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
