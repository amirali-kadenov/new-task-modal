import {
  getCorrectAnswerFromSolution,
  isFormulaStringSolution,
} from '@/modules/tasks/lib/solution-types'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { SharedSolutionDescription } from '@/modules/tasks/ui/common/task-description/ui/shared-solution-description'
import { SharedSolutionBody } from '@/modules/tasks/ui/common/task-solution/shared-solution-body'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Task } from '@/types/api/task'
import { MathFormula } from '@/ui/math-text/math-formula'

import { joinMathAnswers } from '../../text/lib/join-math-answers'
import { stripMathDelimiters } from '../../text/lib/strip-math-delimiters'
import type { FormulaTask } from '../lib/types.task'

import styles from './formula.module.scss'

/** Solution view for single-input formula templates. */
export const FormulaSolution = ({
  task,
  deps,
  answer,
  solution,
}: TaskSolutionComponentProps<FormulaTask>) => {
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
      <SharedSolutionDescription
        task={task as unknown as Task<'formula'>}
        deps={deps}
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

      <SharedSolutionBody solution={solution} deps={deps} />
    </div>
  )
}
