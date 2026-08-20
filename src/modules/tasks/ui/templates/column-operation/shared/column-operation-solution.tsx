import {
  getCorrectAnswerFromSolution,
  isFormulaStringSolution,
} from '@/modules/tasks/lib/solution-types'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { getDescriptionTranslation } from '@/modules/tasks/ui/common/task-description/model/get-description-translation'
import { SharedSolutionBody } from '@/modules/tasks/ui/common/task-solution/shared-solution-body'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Task } from '@/types/api/task'
import { MathFormula } from '@/ui/math-text/math-formula'

import { joinMathAnswers } from '../../text/lib/join-math-answers'
import { stripMathDelimiters } from '../../text/lib/strip-math-delimiters'
import {
  isDivisionCornerTex,
  parseDivisionCorner,
} from '../lib/parse-division-corner'
import { toDivisionCornerNumbers } from '../lib/parse-division-corner-numbers'
import type { ColumnOperationTask } from '../lib/types.task'

import { ColumnOperationDescription } from './column-operation-description'
import styles from './column-operation.module.scss'
import { LongDivisionSteps } from './long-division-steps'

/** Solution view for single-input columnOperation templates. */
export const ColumnOperationSolution = ({
  task,
  deps,
  answer,
  solution,
}: TaskSolutionComponentProps<ColumnOperationTask>) => {
  const correctAnswer = stripMathDelimiters(
    getCorrectAnswerFromSolution(solution, (value) =>
      deps.global.translateTasks(value),
    ),
  )
  const isFormulaOnly = isFormulaStringSolution(solution)
  const panelCorrectAnswer = joinMathAnswers([correctAnswer])

  const rawDescription = getDescriptionTranslation(
    task as unknown as Task<'columnOperation'>,
    deps,
  )
  const isDivision = Boolean(
    rawDescription && isDivisionCornerTex(rawDescription),
  )
  const divisionCornerParts =
    isDivision && rawDescription
      ? parseDivisionCorner(rawDescription, {
          quotient: correctAnswer || undefined,
        })
      : null
  const divisionNumbers = divisionCornerParts
    ? toDivisionCornerNumbers(divisionCornerParts)
    : null

  return (
    <div className={styles.container}>
      <TaskTitle title={task.title} deps={deps} />
      {divisionNumbers ? (
        <LongDivisionSteps
          dividend={divisionNumbers.dividend}
          divisor={divisionNumbers.divisor}
        />
      ) : (
        <ColumnOperationDescription
          task={task}
          deps={deps}
          quotient={correctAnswer || undefined}
        />
      )}

      {!isFormulaOnly && (
        <>
          <SolutionAnswerPanel
            userAnswer={answer}
            correctAnswer={panelCorrectAnswer}
            deps={deps}
          />
          {correctAnswer && !isDivision && (
            <div className={`${styles.inputRow} ${styles.solutionRow}`}>
              <MathFormula className={styles.answerFormula}>
                {correctAnswer}
              </MathFormula>
            </div>
          )}
        </>
      )}

      {isFormulaOnly && (
        <SolutionAnswerPanel
          userAnswer={answer}
          correctAnswer={panelCorrectAnswer}
          deps={deps}
        />
      )}

      <SharedSolutionBody
        solution={solution}
        deps={deps}
        suppressFreeTextContent={Boolean(divisionNumbers)}
      />
    </div>
  )
}
