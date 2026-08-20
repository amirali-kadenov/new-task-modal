import { getCorrectAnswerFromSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { SharedSolutionBody } from '@/modules/tasks/ui/common/task-solution/shared-solution-body'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'

import { EquationAnswerRow } from './equation-answer-row'
import { EquationContent } from './equation-content'
import styles from './equation.module.scss'
import type { EquationTask } from './lib/types.task'

type Props = TaskSolutionComponentProps<EquationTask> & {
  withBefore?: boolean
  withAfter?: boolean
}

/** Solution view for equation templates. */
export const EquationSolution = ({
  task,
  deps,
  answer,
  solution,
  withBefore = false,
  withAfter = false,
}: Props) => {
  const correctAnswer = getCorrectAnswerFromSolution(solution, (value) =>
    deps.global.translateTasks(value),
  )

  return (
    <div className={styles.container}>
      <TaskTitle title={task.title} deps={deps} />
      <EquationContent description={task.description} deps={deps} />

      <SolutionAnswerPanel
        userAnswer={answer}
        correctAnswer={correctAnswer}
        deps={deps}
      />

      <EquationAnswerRow
        answerInput={task.answerInput}
        deps={deps}
        answer={answer}
        mode="solution"
        withBefore={withBefore}
        withAfter={withAfter}
        correctAnswer={correctAnswer}
      />

      <SharedSolutionBody solution={solution} deps={deps} />
    </div>
  )
}
