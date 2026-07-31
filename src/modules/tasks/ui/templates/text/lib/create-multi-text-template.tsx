import { getInlineInputEntries } from '@/modules/tasks/lib/get-inline-input-entries'
import { getMultipleInputHandlers } from '@/modules/tasks/lib/get-multiple-input-handlers'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Task } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'

import { MultiTextSolution } from '../shared/multi-text-solution'
import { TextAdornment } from '../shared/text-adornment'
import { TextTaskDescription } from '../shared/text-task-description'
import styles from '../shared/text-template.module.scss'

import { maybeNormalizeBareMath } from './normalize-bare-math'
import type { TextTask } from './types.task'

interface MultiTextTemplateConfig {
  /** templateId, e.g. `text.multi.stack.n2.beforeAfter`. */
  id: string
  /** `stack` — each input on its own row; `inline` — all inputs in one row. */
  layout: 'stack' | 'inline'
  /** Documented input count (`input1..N`); rendering follows actual data. */
  inputCount: number
  withBefore?: boolean
  withAfter?: boolean
  /**
   * Wrap bare `unit^n` in description/adornments for MathJax.
   * Default off — enable only for templates that need it.
   */
  normalizeBareMath?: boolean
}

/**
 * Multi-input text template: title + description + `input1..N`
 * MathInputs, each with optional before/after labels. The combined answer
 * is joined with the multiple-answer separator.
 */
export const createMultiTextTemplate = ({
  id,
  layout,
  withBefore = false,
  withAfter = false,
  normalizeBareMath: shouldNormalize = false,
}: MultiTextTemplateConfig) => {
  const MultiTextTemplate = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<TextTask>) => {
    if (isActiveSolution(task.solution)) {
      return (
        <MultiTextSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
          layout={layout}
          normalizeBareMath={shouldNormalize}
        />
      )
    }

    const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
    const { setRef, handleChange } = getMultipleInputHandlers({
      onChange,
      separator,
      mathInput,
    })

    const answerValues = answer.split(separator)
    const inputEntries = getInlineInputEntries(
      task as unknown as Task<'text'>,
      (value) => deps.global.translateTasks(value),
    )

    return (
      <div className={styles.container} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />
        <TextTaskDescription
          task={task as unknown as Task<'text'>}
          deps={deps}
          normalizeBareMath={shouldNormalize}
        />

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
                  value={maybeNormalizeBareMath(before, shouldNormalize)}
                />
              )}
              <MathInput
                id={key}
                ref={setRef}
                formula={answerValues[index] ?? ''}
                onMathFieldChanged={handleChange}
                className={styles.input}
              />
              {withAfter && after && (
                <TextAdornment
                  data-testid="text-suffix"
                  className={styles.suffix}
                  value={maybeNormalizeBareMath(after, shouldNormalize)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  MultiTextTemplate.displayName = id

  return MultiTextTemplate
}
