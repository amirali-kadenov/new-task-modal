import { getInlineInputEntries } from '@/modules/tasks/lib/get-inline-input-entries'
import { getMultipleInputHandlers } from '@/modules/tasks/lib/get-multiple-input-handlers'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import { TextAdornment } from '@/modules/tasks/ui/templates/text/shared/text-adornment'
import type { Task } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'

import { ComplexDescription } from '../shared/complex-description'
import styles from '../shared/complex.module.scss'
import { complexDescriptionHasTableAnswerCells } from '../shared/figures/table-part'
import { MultiComplexSolution } from '../shared/multi-complex-solution'

import type { ComplexTask } from './types.task'

interface MultiComplexTemplateConfig {
  id: string
  layout: 'stack' | 'inline'
  inputCount: number
  withBefore?: boolean
  withAfter?: boolean
}

/** Multi-input complex template (`input1..N`). */
export const createMultiComplexTemplate = ({
  id,
  layout,
  withBefore = false,
  withAfter = false,
}: MultiComplexTemplateConfig) => {
  const MultiComplexTemplate = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<ComplexTask>) => {
    if (isActiveSolution(task.solution)) {
      return (
        <MultiComplexSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
          layout={layout}
        />
      )
    }

    const hideInput = Boolean(task.description?.isAnswerCellHidden)
    const tableHasAnswerCells = complexDescriptionHasTableAnswerCells(
      task.description?.parts,
    )
    const useTableInputs = hideInput && tableHasAnswerCells
    const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
    const { setRef, bindRef, handleChange } = getMultipleInputHandlers({
      onChange,
      separator,
      mathInput,
    })

    let tableInputCounter = 0
    const tableAnswerBindings = useTableInputs
      ? {
          answer,
          separator,
          bindRef,
          handleChange,
          nextInputIndex: () => tableInputCounter++,
        }
      : null

    const answerValues = splitMultiAnswer(answer, separator)
    const inputEntries = getInlineInputEntries(
      task as unknown as Task<'text'>,
      (value) => deps.global.translateTasks(value),
    )

    return (
      <div className={styles.container} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />
        <ComplexDescription
          description={task.description}
          deps={deps}
          tableAnswerBindings={tableAnswerBindings}
        />

        {!hideInput ? (
          <div
            data-testid="text-inputs"
            data-layout={layout}
            className={layout === 'inline' ? styles.inline : styles.stack}
          >
            {inputEntries.map(({ key, before, after }, index) => (
              <div key={key} className={styles.inputRow}>
                {withBefore && before ? (
                  <TextAdornment
                    data-testid="text-prefix"
                    className={styles.fieldLabel}
                    value={before}
                  />
                ) : null}
                <MathInput
                  id={key}
                  ref={setRef}
                  formula={answerValues[index] ?? ''}
                  onMathFieldChanged={handleChange}
                  className={styles.input}
                />
                {withAfter && after ? (
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
      </div>
    )
  }

  MultiComplexTemplate.displayName = id

  return MultiComplexTemplate
}
