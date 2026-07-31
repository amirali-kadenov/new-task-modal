import { getCorrectAnswerFromSolution } from '@/modules/tasks/lib/solution-types'
import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { SolutionExplanation } from '@/modules/tasks/ui/common/task-solution/solution-explanation'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Task, Translation } from '@/types/api/task'
import { MathFormula } from '@/ui/math-text/math-formula'

import { joinMathAnswers } from '../lib/join-math-answers'
import { maybeNormalizeBareMath } from '../lib/normalize-bare-math'
import { stripMathDelimiters } from '../lib/strip-math-delimiters'
import type { SimpleTextAnswerInput, TextTask } from '../lib/types.task'

import { TextAdornment } from './text-adornment'
import { TextTaskDescription } from './text-task-description'
import styles from './text-template.module.scss'

type Props = TaskSolutionComponentProps<TextTask> & {
  withBefore?: boolean
  withAfter?: boolean
  answerInputAsSuffix?: boolean
  normalizeBareMath?: boolean
}

const translateAdornment = (
  value: string | Translation | undefined,
  translate: (value: Translation | string) => string,
): string => {
  if (value == null) return ''
  if (isTranslation(value)) return translate(value)
  return typeof value === 'string' ? value : ''
}

/** Solution view shared by all single-input text templates. */
export const TextSolution = ({
  task,
  deps,
  answer,
  solution,
  withBefore = false,
  withAfter = false,
  answerInputAsSuffix = false,
  normalizeBareMath: shouldNormalize = false,
}: Props) => {
  const translate = (value: Translation | string) =>
    deps.global.translateTasks(value)

  const correctAnswer = stripMathDelimiters(
    getCorrectAnswerFromSolution(solution, translate),
  )

  const answerInput = task.answerInput as SimpleTextAnswerInput | undefined

  const prefix = withBefore
    ? maybeNormalizeBareMath(
        translateAdornment(answerInput?.before, translate),
        shouldNormalize,
      )
    : ''
  const suffix = answerInputAsSuffix
    ? maybeNormalizeBareMath(
        translateAdornment(task.answerInput as Translation, translate),
        shouldNormalize,
      )
    : withAfter
      ? maybeNormalizeBareMath(
          translateAdornment(answerInput?.after, translate),
          shouldNormalize,
        )
      : ''

  return (
    <div className={styles.container}>
      <TaskTitle title={task.title} deps={deps} />
      <TextTaskDescription
        task={task as unknown as Task<'text'>}
        deps={deps}
        normalizeBareMath={shouldNormalize}
      />

      <SolutionAnswerPanel
        userAnswer={answer}
        correctAnswer={joinMathAnswers([correctAnswer])}
        deps={deps}
      />

      {correctAnswer && (prefix || suffix) && (
        <div className={`${styles.inputRow} ${styles.solutionRow}`}>
          {prefix && (
            <TextAdornment
              data-testid="text-prefix"
              className={styles.prefix}
              value={prefix}
            />
          )}
          <MathFormula className={styles.answerFormula}>
            {correctAnswer}
          </MathFormula>
          {suffix && (
            <TextAdornment
              data-testid="text-suffix"
              className={styles.suffix}
              value={suffix}
            />
          )}
        </div>
      )}

      <SolutionExplanation solution={solution} deps={deps} />
    </div>
  )
}
