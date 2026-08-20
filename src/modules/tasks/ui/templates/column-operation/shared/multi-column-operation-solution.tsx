import { getCorrectMultiAnswerParts } from '@/modules/tasks/lib/get-correct-multi-answer-parts'
import { getInlineInputEntries } from '@/modules/tasks/lib/get-inline-input-entries'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import type { TaskSolutionComponentProps } from '@/modules/tasks/model/types'
import { getDescriptionTranslation } from '@/modules/tasks/ui/common/task-description/model/get-description-translation'
import { SharedSolutionBody } from '@/modules/tasks/ui/common/task-solution/shared-solution-body'
import { SolutionAnswerPanel } from '@/modules/tasks/ui/common/task-solution/solution-answer-panel'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Task } from '@/types/api/task'
import { MathFormula } from '@/ui/math-text/math-formula'

import { joinMathAnswers } from '../../text/lib/join-math-answers'
import { TextAdornment } from '../../text/shared/text-adornment'
import {
  isDivisionCornerTex,
  parseDivisionCorner,
} from '../lib/parse-division-corner'
import { toDivisionCornerNumbers } from '../lib/parse-division-corner-numbers'
import type { ColumnOperationTask } from '../lib/types.task'

import { ColumnOperationDescription } from './column-operation-description'
import styles from './column-operation.module.scss'
import { LongDivisionSteps } from './long-division-steps'

type Props = TaskSolutionComponentProps<ColumnOperationTask> & {
  layout: 'stack' | 'inline'
}

/** Solution view for multi-input columnOperation templates. */
export const MultiColumnOperationSolution = ({
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

  const inputEntries = getInlineInputEntries(
    task as unknown as Task<'columnOperation'>,
    translate,
  )

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
          quotient: correctValues[0] || undefined,
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
          quotient={correctValues[0] || undefined}
          remainder={correctValues[1] || undefined}
        />
      )}

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
          <div key={key} className={`${styles.inputRow} ${styles.solutionRow}`}>
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

      <SharedSolutionBody
        solution={solution}
        deps={deps}
        suppressFreeTextContent={Boolean(divisionNumbers)}
      />
    </div>
  )
}
