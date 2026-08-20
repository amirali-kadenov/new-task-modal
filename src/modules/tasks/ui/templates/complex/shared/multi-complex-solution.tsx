import { getCorrectMultiAnswerParts } from '@/modules/tasks/lib/get-correct-multi-answer-parts'
import { getInlineInputEntries } from '@/modules/tasks/lib/get-inline-input-entries'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { SharedSolutionBody } from '@/modules/tasks/ui/common/task-solution/shared-solution-body'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import { joinMathAnswers } from '@/modules/tasks/ui/templates/text/lib/join-math-answers'
import { TextAdornment } from '@/modules/tasks/ui/templates/text/shared/text-adornment'
import type { Task } from '@/types/api/task'
import { MathFormula } from '@/ui/math-text/math-formula'

import type { ComplexTask } from '../lib/types.task'

import { ComplexDescription } from './complex-description'
import styles from './complex.module.scss'
import { complexDescriptionHasTableAnswerCells } from './figures/table-part'

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

  const correctValues = getCorrectMultiAnswerParts(
    solution,
    separator,
    translate,
  )
  const userValues = splitMultiAnswer(answer, separator)
  const hideInput = Boolean(task.description?.isAnswerCellHidden)
  const tableSolutionAnswers = complexDescriptionHasTableAnswerCells(
    task.description?.parts,
  )
    ? correctValues
    : null

  const inputEntries = getInlineInputEntries(
    task as unknown as Task<'text'>,
    translate,
  )

  return (
    <div className={styles.container}>
      <TaskTitle title={task.title} deps={deps} />
      <ComplexDescription
        description={task.description}
        deps={deps}
        tableSolutionAnswers={tableSolutionAnswers}
      />

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

      <SharedSolutionBody solution={solution} deps={deps} />
    </div>
  )
}
