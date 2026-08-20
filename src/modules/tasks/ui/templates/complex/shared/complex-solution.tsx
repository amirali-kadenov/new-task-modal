import { getCorrectAnswerFromSolution } from '@/modules/tasks/lib/solution-types'
import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { SharedSolutionBody } from '@/modules/tasks/ui/common/task-solution/shared-solution-body'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import { joinMathAnswers } from '@/modules/tasks/ui/templates/text/lib/join-math-answers'
import { stripMathDelimiters } from '@/modules/tasks/ui/templates/text/lib/strip-math-delimiters'
import { TextAdornment } from '@/modules/tasks/ui/templates/text/shared/text-adornment'
import type { Translation } from '@/types/api/task'
import { MathFormula } from '@/ui/math-text/math-formula'

import { isTextOnlyComplexDescription } from '../lib/is-text-only-complex-description'
import type { ComplexTask, SimpleComplexAnswerInput } from '../lib/types.task'

import { ComplexSolutionCondition } from './complex-solution-condition'
import styles from './complex.module.scss'

type Props = TaskSolutionComponentProps<ComplexTask> & {
  id: string
  withBefore?: boolean
  withAfter?: boolean
  equationLayout?: boolean
}

const translateAdornment = (
  value: string | Translation | undefined,
  translate: (value: Translation | string) => string,
): string => {
  if (value == null) return ''
  if (isTranslation(value)) return translate(value)
  return typeof value === 'string' ? value : ''
}

/** Solution view for single-input complex templates. */
export const ComplexSolution = ({
  task,
  deps,
  answer,
  solution,
  id,
  withBefore = false,
  withAfter = false,
  equationLayout = false,
}: Props) => {
  const translate = (value: Translation | string) =>
    deps.global.translateTasks(value)

  const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator

  // Strip then re-wrap: panel uses MathText (needs `\(...\)`); MathFormula wraps itself.
  const correctAnswer = stripMathDelimiters(
    getCorrectAnswerFromSolution(solution, translate),
  )
  const answerInput = task.answerInput as SimpleComplexAnswerInput | undefined
  const hideInput = Boolean(task.description?.isAnswerCellHidden)
  const showAnswer = !hideInput && Boolean(correctAnswer)
  const inlineExpression =
    showAnswer && isTextOnlyComplexDescription(task.description)

  const prefix = withBefore
    ? translateAdornment(answerInput?.before, translate)
    : ''
  const suffix = withAfter
    ? translateAdornment(answerInput?.after, translate)
    : ''

  const answerControls = showAnswer ? (
    <>
      {prefix ? (
        <TextAdornment
          data-testid="text-prefix"
          className={styles.prefix}
          value={prefix}
        />
      ) : null}
      <MathFormula className={styles.answerFormula}>
        {correctAnswer}
      </MathFormula>
      {suffix ? (
        <TextAdornment
          data-testid="text-suffix"
          className={styles.suffix}
          value={suffix}
        />
      ) : null}
    </>
  ) : null

  // Standalone adornment row only when prefix/suffix — bare MathFormula
  // would duplicate the panel answer (same rule as text-solution).
  const showAdornmentRow = Boolean(answerControls && (prefix || suffix))

  const answerPanel = (
    <SolutionAnswerPanel
      userAnswer={answer}
      correctAnswer={joinMathAnswers([correctAnswer])}
      deps={deps}
    />
  )

  const description = (
    <ComplexSolutionCondition
      description={task.description}
      deps={deps}
      solution={solution}
      separator={separator}
      translate={translate}
      equationLayout={equationLayout}
    />
  )

  return (
    <div className={styles.container} data-template-id={id}>
      <TaskTitle title={task.title} deps={deps} />

      {inlineExpression ? (
        <>
          {answerPanel}
          <div
            className={`${styles.expressionRow} ${styles.solutionRow}`}
            data-layout="inline"
            data-testid="complex-expression-row"
          >
            {description}
            {answerControls}
          </div>
        </>
      ) : (
        <>
          {description}
          {answerPanel}
          {showAdornmentRow ? (
            <div className={`${styles.inputRow} ${styles.solutionRow}`}>
              {answerControls}
            </div>
          ) : null}
        </>
      )}

      <SharedSolutionBody solution={solution} deps={deps} />
    </div>
  )
}
