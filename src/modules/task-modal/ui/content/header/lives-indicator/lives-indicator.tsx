import HeartBrokenIcon from '@/assets/icons/header/heart-broken.svg'
import { useAppState } from '@/modules/task-modal/model/store/task-modal-store'
import type { TaskModalProps } from '@/modules/task-modal/model/types/props'

import { HeartContainer } from './heart-container'
import { HeartDecreaseAnimation } from './heart-decrease-animation'
import { checkIfLastAttemptSuccessfull, getLivesCount } from './lib'

interface LivesIndicatorProps {
  props: TaskModalProps
}

export const LivesIndicator = ({ props }: LivesIndicatorProps) => {
  const state = useAppState()

  const attemptsCount = state.activeTask.attemptsCount ?? 0

  const livesCount = getLivesCount({
    activeTask: state.activeTask,
    tasks: state.tasks ?? [],
  })
  const isLastAttemptSuccessfull = checkIfLastAttemptSuccessfull(props, state)

  // Show heart container with livesCount on correct answer
  if (isLastAttemptSuccessfull) {
    return <HeartContainer heartCount={livesCount} />
  }

  // Show heart decrease animation on wrong answer
  const shouldAnimate = attemptsCount > 0
  if (shouldAnimate) {
    return (
      <HeartDecreaseAnimation
        key={state.activeTask?.id}
        attemptsCount={attemptsCount}
        livesCount={livesCount}
      />
    )
  }

  // Show broken heart if all lives used
  const isAllLivesUsed = attemptsCount >= livesCount
  if (isAllLivesUsed) {
    return <HeartBrokenIcon />
  }

  // Show heart container with remaining hearts
  const remainingHearts = livesCount - attemptsCount
  return <HeartContainer heartCount={remainingHearts} />
}
