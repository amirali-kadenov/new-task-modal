import { getCorrectMultiAnswerParts } from '@/modules/tasks/lib/get-correct-multi-answer-parts'
import {
  joinMultiAnswer,
  splitMultiAnswer,
} from '@/modules/tasks/lib/multi-answer'
import { isPlaceholderAnswer } from '@/modules/tasks/lib/solution-types'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { SharedSolutionBody } from '@/modules/tasks/ui/common/task-solution/shared-solution-body'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'

import { joinMathAnswers } from '../../text/lib/join-math-answers'
import { stripMathDelimiters } from '../../text/lib/strip-math-delimiters'
import { getAnswerCellUnit } from '../lib/get-answer-cell-unit'
import type {
  AnswerCellTask,
  SimpleAnswerCellAnswerInput,
} from '../lib/types.task'

import { AnswerCellDescriptionExtras } from './answer-cell-description-extras'
import { AnswerCellRow } from './answer-cell-row'
import styles from './answer-cell.module.scss'

type Props = TaskSolutionComponentProps<AnswerCellTask> & {
  withBefore?: boolean
  withAfter?: boolean
  multi?: boolean
  solutionAlignCenter?: boolean
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
  solutionAlignCenter = false,
}: Props) => {
  const translate = (value: Parameters<typeof deps.global.translateTasks>[0]) =>
    deps.global.translateTasks(value)

  const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
  const correctParts = getCorrectMultiAnswerParts(
    solution,
    separator,
    translate,
  )

  const userDisplay = multi
    ? splitMultiAnswer(stripMathDelimiters(answer), separator).join(' ; ')
    : stripMathDelimiters(answer)

  // Backend sometimes has no structured answer for this task (placeholder
  // `\(\)` in every language) — the real value only exists as explanation
  // prose. Hide the row instead of rendering empty answercell inputs.
  const hasCorrectAnswer = correctParts.some(
    (part) => !isPlaceholderAnswer(part),
  )

  const unit =
    withAfter && !multi
      ? getAnswerCellUnit(
          task.answerInput as SimpleAnswerCellAnswerInput | undefined,
          translate,
        )
      : ''

  return (
    <div className={styles.container}>
      <TaskTitle title={task.title} deps={deps} />
      <AnswerCellDescriptionExtras description={task.description} deps={deps} />

      <SolutionAnswerPanel
        userAnswer={userDisplay}
        correctAnswer={joinMathAnswers(correctParts)}
        unit={unit}
        deps={deps}
        alignCenter={solutionAlignCenter}
      />

      {hasCorrectAnswer ? (
        <AnswerCellRow
          description={task.description}
          answerInput={task.answerInput}
          deps={deps}
          answer={joinMultiAnswer(correctParts, separator)}
          mode="solution"
          withBefore={withBefore}
          withAfter={withAfter}
          multi={multi}
          taskType={task.type}
          solutionAlignCenter={solutionAlignCenter}
        />
      ) : null}

      <SharedSolutionBody solution={solution} deps={deps} />
    </div>
  )
}
