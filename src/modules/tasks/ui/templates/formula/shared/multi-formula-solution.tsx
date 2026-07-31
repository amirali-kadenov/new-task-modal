import { getInlineInputEntries } from '@/modules/tasks/lib/get-inline-input-entries'
import { getCorrectAnswerFromSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { SolutionExplanation } from '@/modules/tasks/ui/common/task-solution/solution-explanation'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Task } from '@/types/api/task'
import { MathFormula } from '@/ui/math-text/math-formula'

import { joinMathAnswers } from '../../text/lib/join-math-answers'
import { stripMathDelimiters } from '../../text/lib/strip-math-delimiters'
import { TextAdornment } from '../../text/shared/text-adornment'
import type { FormulaTask } from '../lib/types.task'
import { FormulaDescription } from './formula-description'
import styles from './formula.module.scss'

type Props = TaskSolutionComponentProps<FormulaTask> & {
  layout: 'stack' | 'inline'
}

/** Solution view for multi-input formula templates. */
export const MultiFormulaSolution = ({
  task,
  deps,
  answer,
  solution,
  layout,
}: Props) => {
  const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
  const translate = (value: Parameters<typeof deps.global.translateTasks>[0]) =>
    deps.global.translateTasks(value)

  const correctValues = stripMathDelimiters(
    getCorrectAnswerFromSolution(solution, translate),
  ).split(separator)
  const userValues = answer.split(separator)

  const inputEntries = getInlineInputEntries(
    task as unknown as Task<'formula'>,
    translate,
  )

  return (
    <div className={styles.container}>
      <TaskTitle title={task.title} deps={deps} />
      <FormulaDescription task={task} deps={deps} />

      <SolutionAnswerPanel
        userAnswer={userValues.join(' ; ')}
        correctAnswer={joinMathAnswers(correctValues)}
        deps={deps}
      />

      <div
        data-testid="text-inputs"
        data-layout={layout}
        className={layout === 'inline' ? styles.inline : styles.stack}
      >
        {inputEntries.map(({ key, before, after }, index) => (
          <div
            key={key}
            className={`${styles.inputRow} ${styles.solutionRow}`}
          >
            {before && (
              <TextAdornment
                data-testid="text-prefix"
                className={styles.fieldLabel}
                value={before}
              />
            )}
            <MathFormula className={styles.answerFormula}>
              {correctValues[index] ?? ''}
            </MathFormula>
            {after && (
              <TextAdornment
                data-testid="text-suffix"
                className={styles.suffix}
                value={after}
              />
            )}
          </div>
        ))}
      </div>

      <SolutionExplanation solution={solution} deps={deps} />
    </div>
  )
}
