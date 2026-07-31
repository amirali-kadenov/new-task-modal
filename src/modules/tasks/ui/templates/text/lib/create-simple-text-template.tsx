import { setMathInputRef } from '@/modules/tasks/lib/set-math-input-ref'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Task, Translation } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'

import { TextAdornment } from '../shared/text-adornment'
import { TextSolution } from '../shared/text-solution'
import { TextTaskDescription } from '../shared/text-task-description'
import styles from '../shared/text-template.module.scss'

import { maybeNormalizeBareMath } from './normalize-bare-math'
import type { SimpleTextAnswerInput, TextTask } from './types.task'

interface SimpleTextTemplateConfig {
  /** templateId, e.g. `text.after` — used as displayName and test hook. */
  id: string
  withBefore?: boolean
  withAfter?: boolean
  /**
   * `text.aiTranslation` only: the whole answerInput is a Translation used
   * as the suffix label instead of `answerInput.after`.
   */
  answerInputAsSuffix?: boolean
  /**
   * Wrap bare `unit^n` in description/adornments for MathJax.
   * Enable only for templates that need it (e.g. `text.after` / text_6).
   */
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

/**
 * Single `MathInput` text template: title + description + optional
 * before/after adornments around the input.
 */
export const createSimpleTextTemplate = ({
  id,
  withBefore = false,
  withAfter = false,
  answerInputAsSuffix = false,
  normalizeBareMath: shouldNormalize = false,
}: SimpleTextTemplateConfig) => {
  const SimpleTextTemplate = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<TextTask>) => {
    if (isActiveSolution(task.solution)) {
      return (
        <TextSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
          withBefore={withBefore}
          withAfter={withAfter}
          answerInputAsSuffix={answerInputAsSuffix}
          normalizeBareMath={shouldNormalize}
        />
      )
    }

    const translate = (value: Translation | string) =>
      deps.global.translateTasks(value)

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
      <div className={styles.container} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />
        <TextTaskDescription
          task={task as unknown as Task<'text'>}
          deps={deps}
          normalizeBareMath={shouldNormalize}
        />

        <div className={styles.inputRow}>
          {prefix && (
            <TextAdornment
              data-testid="text-prefix"
              className={styles.prefix}
              value={prefix}
            />
          )}
          <MathInput
            ref={(ref) => setMathInputRef(ref, mathInput)}
            formula={answer}
            onMathFieldChanged={onChange}
            className={styles.input}
          />
          {suffix && (
            <TextAdornment
              data-testid="text-suffix"
              className={styles.suffix}
              value={suffix}
            />
          )}
        </div>
      </div>
    )
  }

  SimpleTextTemplate.displayName = id

  return SimpleTextTemplate
}
