import { getInlineInputEntries } from '@/modules/tasks/lib/get-inline-input-entries'
import { getMultipleInputHandlers } from '@/modules/tasks/lib/get-multiple-input-handlers'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Task } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'

import { TextAdornment } from '../../text/shared/text-adornment'
import { ColumnOperationDescription } from '../shared/column-operation-description'
import styles from '../shared/column-operation.module.scss'
import { MultiColumnOperationSolution } from '../shared/multi-column-operation-solution'

import type { ColumnOperationTask } from './types.task'

interface MultiColumnOperationTemplateConfig {
  /** templateId, e.g. `columnOperation.multi.stack.n2.before`. */
  id: string
  layout: 'stack' | 'inline'
  inputCount: number
  withBefore?: boolean
  withAfter?: boolean
}

/** Multi-input columnOperation template (`input1..N`). */
export const createMultiColumnOperationTemplate = ({
  id,
  layout,
  withBefore = false,
  withAfter = false,
}: MultiColumnOperationTemplateConfig) => {
  const MultiColumnOperationTemplate = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<ColumnOperationTask>) => {
    if (isActiveSolution(task.solution)) {
      return (
        <MultiColumnOperationSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
          layout={layout}
        />
      )
    }

    const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
    const { bindRef, handleChange } = getMultipleInputHandlers({
      onChange,
      separator,
      mathInput,
    })

    const answerValues = splitMultiAnswer(answer, separator)
    const inputEntries = getInlineInputEntries(
      task as unknown as Task<'columnOperation'>,
      (value) => deps.global.translateTasks(value),
    )

    return (
      <div className={styles.container} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />
        <ColumnOperationDescription task={task} deps={deps} />

        <div
          data-testid="text-inputs"
          data-layout={layout}
          className={layout === 'inline' ? styles.inline : styles.stack}
        >
          {inputEntries.map(({ key, before, after }, index) => (
            <div key={key} className={styles.inputRow}>
              {withBefore && before && (
                <TextAdornment
                  data-testid="text-prefix"
                  className={styles.fieldLabel}
                  value={before}
                />
              )}
              <MathInput
                id={key}
                ref={bindRef(key)}
                formula={answerValues[index] ?? ''}
                onMathFieldChanged={handleChange}
                className={styles.input}
              />
              {withAfter && after && (
                <TextAdornment
                  data-testid="text-suffix"
                  className={styles.suffix}
                  value={after}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  MultiColumnOperationTemplate.displayName = id

  return MultiColumnOperationTemplate
}
