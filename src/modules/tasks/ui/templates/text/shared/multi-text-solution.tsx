import { getInlineInputEntries } from '@/modules/tasks/lib/get-inline-input-entries'
import { getCorrectAnswerFromSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { SolutionExplanation } from '@/modules/tasks/ui/common/task-solution/solution-explanation'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Task } from '@/types/api/task'
import { MathFormula } from '@/ui/math-text/math-formula'

import { joinMathAnswers } from '../lib/join-math-answers'
import { maybeNormalizeBareMath } from '../lib/normalize-bare-math'
import { stripMathDelimiters } from '../lib/strip-math-delimiters'
import type { TextTask } from '../lib/types.task'

import { TextAdornment } from './text-adornment'
import { TextTaskDescription } from './text-task-description'
import styles from './text-template.module.scss'

type Props = TaskSolutionComponentProps<TextTask> & {
  /** Same layout as input mode — inline keeps ratio answers like `2 : 7` on one row. */
  layout: 'stack' | 'inline'
  normalizeBareMath?: boolean
}

/** Solution view shared by all multi-input (`input1..N`) text templates. */
export const MultiTextSolution = ({
  task,
  deps,
  answer,
  solution,
  layout,
  normalizeBareMath: shouldNormalize = false,
}: Props) => {
  const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
  const translate = (value: Parameters<typeof deps.global.translateTasks>[0]) =>
    deps.global.translateTasks(value)

  const correctValues = stripMathDelimiters(
    getCorrectAnswerFromSolution(solution, translate),
  ).split(separator)
  const userValues = answer.split(separator)

  const inputEntries = getInlineInputEntries(
    task as unknown as Task<'text'>,
    translate,
  )

  return (
    <div className={styles.container}>
      <TaskTitle title={task.title} deps={deps} />
      <TextTaskDescription
        task={task as unknown as Task<'text'>}
        deps={deps}
        normalizeBareMath={shouldNormalize}
      />

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
                value={maybeNormalizeBareMath(before, shouldNormalize)}
              />
            )}
            <MathFormula className={styles.answerFormula}>
              {correctValues[index] ?? ''}
            </MathFormula>
            {after && (
              <TextAdornment
                data-testid="text-suffix"
                className={styles.suffix}
                value={maybeNormalizeBareMath(after, shouldNormalize)}
              />
            )}
          </div>
        ))}
      </div>

      <SolutionExplanation solution={solution} deps={deps} />
    </div>
  )
}
