import { getInlineInputEntries } from '@/modules/tasks/lib/get-inline-input-entries'
import { getCorrectAnswerFromSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { ComplexSolutionParts } from '@/modules/tasks/ui/common/task-solution/complex-solution-parts'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { SolutionExplanation } from '@/modules/tasks/ui/common/task-solution/solution-explanation'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import { joinMathAnswers } from '@/modules/tasks/ui/templates/text/lib/join-math-answers'
import { TextAdornment } from '@/modules/tasks/ui/templates/text/shared/text-adornment'
import type { Task } from '@/types/api/task'
import { MathFormula } from '@/ui/math-text/math-formula'

import type { ComplexTask } from '../lib/types.task'

import { ComplexDescription } from './complex-description'
import styles from './complex.module.scss'

type Props = TaskSolutionComponentProps<ComplexTask> & {
  layout: 'stack' | 'inline'
}

/** Solution view for multi-input complex templates. */
export const MultiComplexSolution = ({
  task,
  deps,
  answer,
  solution,
  layout,
}: Props) => {
  const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
  const translate = (value: Parameters<typeof deps.global.translateTasks>[0]) =>
    deps.global.translateTasks(value)

  const correctValues = getCorrectAnswerFromSolution(solution, translate).split(
    separator,
  )
  const userValues = answer.split(separator)
  const hideInput = Boolean(task.description?.isAnswerCellHidden)

  const inputEntries = getInlineInputEntries(
    task as unknown as Task<'text'>,
    translate,
  )

  const solutionParts =
    solution &&
    typeof solution === 'object' &&
    'parts' in solution &&
    Array.isArray((solution as { parts?: unknown }).parts)
      ? (solution as { parts: Parameters<typeof ComplexSolutionParts>[0]['parts'] })
          .parts
      : null

  return (
    <div className={styles.container}>
      <TaskTitle title={task.title} deps={deps} />
      <ComplexDescription description={task.description} deps={deps} />

      <SolutionAnswerPanel
        userAnswer={userValues.join(' ; ')}
        correctAnswer={joinMathAnswers(correctValues)}
        deps={deps}
      />

      {!hideInput ? (
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
              {before ? (
                <TextAdornment
                  data-testid="text-prefix"
                  className={styles.fieldLabel}
                  value={before}
                />
              ) : null}
              <MathFormula className={styles.answerFormula}>
                {correctValues[index] ?? ''}
              </MathFormula>
              {after ? (
                <TextAdornment
                  data-testid="text-suffix"
                  className={styles.suffix}
                  value={after}
                />
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {solutionParts ? (
        <ComplexSolutionParts parts={solutionParts} deps={deps} />
      ) : (
        <SolutionExplanation solution={solution} deps={deps} />
      )}
    </div>
  )
}
