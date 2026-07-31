import {
  getCorrectAnswerFromSolution,
  isFormulaStringSolution,
} from '@/modules/tasks/lib/solution-types'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { SolutionExplanation } from '@/modules/tasks/ui/common/task-solution/solution-explanation'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import { MathFormula } from '@/ui/math-text/math-formula'

import { joinMathAnswers } from '../../text/lib/join-math-answers'
import { stripMathDelimiters } from '../../text/lib/strip-math-delimiters'
import type { ColumnOperationTask } from '../lib/types.task'
import { ColumnOperationDescription } from './column-operation-description'
import styles from './column-operation.module.scss'

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

  return (
    <div className={styles.container}>
      <TaskTitle title={task.title} deps={deps} />
      <ColumnOperationDescription
        task={task}
        deps={deps}
        quotient={correctAnswer || undefined}
      />

      {!isFormulaOnly && (
        <>
          <SolutionAnswerPanel
            userAnswer={answer}
            correctAnswer={panelCorrectAnswer}
            deps={deps}
          />
          {correctAnswer && (
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

      <SolutionExplanation solution={solution} deps={deps} />
    </div>
  )
}
