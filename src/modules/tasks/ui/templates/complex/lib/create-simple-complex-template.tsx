import { getMultipleInputHandlers } from '@/modules/tasks/lib/get-multiple-input-handlers'
import { setMathInputRef } from '@/modules/tasks/lib/set-math-input-ref'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import { TextAdornment } from '@/modules/tasks/ui/templates/text/shared/text-adornment'
import type { Translation } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'

import { ComplexDescription } from '../shared/complex-description'
import { ComplexSolution } from '../shared/complex-solution'
import styles from '../shared/complex.module.scss'
import { complexDescriptionHasTableAnswerCells } from '../shared/figures/table-part'

import { isTextOnlyComplexDescription } from './is-text-only-complex-description'
import type { ComplexTask, SimpleComplexAnswerInput } from './types.task'

interface SimpleComplexTemplateConfig {
  id: string
  withBefore?: boolean
  withAfter?: boolean
  /** Centered equation table + input min/max (complex.after.equation). */
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

/** Single MathInput complex template: title + parts + optional adornments. */
export const createSimpleComplexTemplate = ({
  id,
  withBefore = false,
  withAfter = false,
  equationLayout = false,
}: SimpleComplexTemplateConfig) => {
  const SimpleComplexTemplate = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<ComplexTask>) => {
    if (isActiveSolution(task.solution)) {
      return (
        <ComplexSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
          id={id}
          withBefore={withBefore}
          withAfter={withAfter}
          equationLayout={equationLayout}
        />
      )
    }

    const translate = (value: Translation | string) =>
      deps.global.translateTasks(value)

    const answerInput = task.answerInput as SimpleComplexAnswerInput | undefined
    const hideInput = Boolean(task.description?.isAnswerCellHidden)
    const tableHasAnswerCells = complexDescriptionHasTableAnswerCells(
      task.description?.parts,
    )
    // Legacy: when bottom input is hidden, answercells live inside description tables.
    const useTableInputs = hideInput && tableHasAnswerCells
    const inlineExpression =
      !hideInput && isTextOnlyComplexDescription(task.description)

    const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
    const tableHandlers = useTableInputs
      ? getMultipleInputHandlers({ onChange, separator, mathInput })
      : null

    let tableInputCounter = 0
    const tableAnswerBindings = tableHandlers
      ? {
          answer,
          separator,
          bindRef: tableHandlers.bindRef,
          handleChange: tableHandlers.handleChange,
          nextInputIndex: () => tableInputCounter++,
        }
      : null

    const prefix = withBefore
      ? translateAdornment(answerInput?.before, translate)
      : ''
    const suffix = withAfter
      ? translateAdornment(answerInput?.after, translate)
      : ''

    const inputControls = !hideInput ? (
      <>
        {prefix ? (
          <TextAdornment
            data-testid="text-prefix"
            className={styles.prefix}
            value={prefix}
          />
        ) : null}
        <MathInput
          ref={(ref) => setMathInputRef(ref, mathInput)}
          formula={answer}
          onMathFieldChanged={onChange}
          className={styles.input}
        />
        {suffix ? (
          <TextAdornment
            data-testid="text-suffix"
            className={styles.suffix}
            value={suffix}
          />
        ) : null}
      </>
    ) : null

    return (
      <div className={styles.container} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />

        {inlineExpression ? (
          <div
            className={styles.expressionRow}
            data-layout="inline"
            data-testid="complex-expression-row"
          >
            <ComplexDescription
              description={task.description}
              deps={deps}
              tableAnswerBindings={tableAnswerBindings}
              equationLayout={equationLayout}
            />
            {inputControls}
          </div>
        ) : (
          <>
            <ComplexDescription
              description={task.description}
              deps={deps}
              tableAnswerBindings={tableAnswerBindings}
              equationLayout={equationLayout}
            />
            {inputControls ? (
              <div className={styles.inputRow}>{inputControls}</div>
            ) : null}
          </>
        )}
      </div>
    )
  }

  SimpleComplexTemplate.displayName = id

  return SimpleComplexTemplate
}
