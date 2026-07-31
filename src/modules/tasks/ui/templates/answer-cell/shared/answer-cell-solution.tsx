import { getCorrectAnswerFromSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { SolutionExplanation } from '@/modules/tasks/ui/common/task-solution/solution-explanation'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'

import { joinMathAnswers } from '../../text/lib/join-math-answers'
import { stripMathDelimiters } from '../../text/lib/strip-math-delimiters'
import type { AnswerCellTask } from '../lib/types.task'

import { AnswerCellDescriptionExtras } from './answer-cell-description-extras'
import { AnswerCellRow } from './answer-cell-row'
import styles from './answer-cell.module.scss'

type Props = TaskSolutionComponentProps<AnswerCellTask> & {
  withBefore?: boolean
  withAfter?: boolean
  multi?: boolean
}

/** Solution view for answerCell templates. */
export const AnswerCellSolution = ({
  task,
  deps,
  answer,
  solution,
  withBefore = false,
  withAfter = false,
  multi = false,
}: Props) => {
  const translate = (value: Parameters<typeof deps.global.translateTasks>[0]) =>
    deps.global.translateTasks(value)

  const correctAnswer = stripMathDelimiters(
    getCorrectAnswerFromSolution(solution, translate),
  )
  const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator

  const correctParts = multi
    ? correctAnswer.split(separator)
    : [correctAnswer]

  const userDisplay = multi
    ? answer.split(separator).join(' ; ')
    : answer

  return (
    <div className={styles.container}>
      <TaskTitle title={task.title} deps={deps} />
      <AnswerCellDescriptionExtras
        description={task.description}
        deps={deps}
      />

      <SolutionAnswerPanel
        userAnswer={userDisplay}
        correctAnswer={joinMathAnswers(correctParts)}
        deps={deps}
      />

      <AnswerCellRow
        description={task.description}
        answerInput={task.answerInput}
        deps={deps}
        answer={correctAnswer}
        mode="solution"
        withBefore={withBefore}
        withAfter={withAfter}
        multi={multi}
      />

      <SolutionExplanation solution={solution} deps={deps} />
    </div>
  )
}
