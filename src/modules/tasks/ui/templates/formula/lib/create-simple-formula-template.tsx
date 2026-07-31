import { setMathInputRef } from '@/modules/tasks/lib/set-math-input-ref'
import { isActiveSolution } from '@/modules/tasks/lib/solution-types'
import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import type { Translation } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'

import { TextAdornment } from '../../text/shared/text-adornment'
import { FormulaDescription } from '../shared/formula-description'
import { FormulaSolution } from '../shared/formula-solution'
import styles from '../shared/formula.module.scss'
import type { FormulaTask, SimpleFormulaAnswerInput } from './types.task'

interface SimpleFormulaTemplateConfig {
  /** templateId, e.g. `formula.after` — used as displayName and test hook. */
  id: string
  withBefore?: boolean
  withAfter?: boolean
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
 * Single `MathInput` formula template: title + one row with the expression
 * beside the input (`content` ends with `=`, e.g. `10000 + 3 = `), matching
 * old `formula.tsx` layout.
 */
export const createSimpleFormulaTemplate = ({
  id,
  withBefore = false,
  withAfter = false,
}: SimpleFormulaTemplateConfig) => {
  const SimpleFormulaTemplate = ({
    task,
    deps,
    answer,
    onChange,
    mathInput,
  }: TaskComponentProps<FormulaTask>) => {
    if (isActiveSolution(task.solution)) {
      return (
        <FormulaSolution
          task={task}
          deps={deps}
          answer={answer}
          solution={task.solution}
        />
      )
    }

    const translate = (value: Translation | string) =>
      deps.global.translateTasks(value)

    const answerInput = task.answerInput as SimpleFormulaAnswerInput | undefined

    const prefix = withBefore
      ? translateAdornment(answerInput?.before, translate)
      : ''
    const suffix = withAfter
      ? translateAdornment(answerInput?.after, translate)
      : ''

    return (
      <div className={styles.container} data-template-id={id}>
        <TaskTitle title={task.title} deps={deps} />

        <div className={styles.expressionRow}>
          <FormulaDescription task={task} deps={deps} />
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

  SimpleFormulaTemplate.displayName = id

  return SimpleFormulaTemplate
}
