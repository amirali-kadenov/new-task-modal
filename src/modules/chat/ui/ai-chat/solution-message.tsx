import { ErrorBoundary } from '@/lib/error-boundary/error-boundary'
import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import type { Task } from '@/types/api/task'
import { SpoilerText } from '@/ui/spoiler/spoiler'

import { ChatSolutionView } from './chat-solution-view'
import { ANSWER_SOLUTION_INTRO_TEXT } from './model/constants'
import s from './solution-message.module.scss'

interface Props {
  task: Task
  deps: TaskModalDependencies
  answer: string
}

export const SolutionMessage = ({ task, deps, answer }: Props) => {
  return (
    <ErrorBoundary>
      <div className={s.intro}>{ANSWER_SOLUTION_INTRO_TEXT}</div>
      <SpoilerText>
        <ChatSolutionView task={task} deps={deps} answer={answer} />
      </SpoilerText>
    </ErrorBoundary>
  )
}
