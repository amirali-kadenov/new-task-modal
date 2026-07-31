import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import type { Translation } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'
import type { MathInputRef } from '@/ui/math-input/types'
import { MathFormula } from '@/ui/math-text/math-formula'

import { TextAdornment } from '../../text/shared/text-adornment'

import type { EquationAnswerInput } from './lib/types.task'
import styles from './equation.module.scss'

interface Props {
  answerInput: EquationAnswerInput | undefined
  deps: TaskModalDependencies
  answer: string
  mode: 'input' | 'solution'
  withBefore?: boolean
  withAfter?: boolean
  onChange?: (value: string) => void
  mathInputRef?: (ref: MathInputRef | null) => void
  correctAnswer?: string
}

const translateAdornment = (
  value: string | Translation | undefined,
  translate: (value: Translation | string) => string,
): string => {
  if (value == null) return ''
  return translate(value)
}

/** before | MathInput/MathFormula | after */
export const EquationAnswerRow = ({
  answerInput,
  deps,
  answer,
  mode,
  withBefore = false,
  withAfter = false,
  onChange,
  mathInputRef,
  correctAnswer,
}: Props) => {
  const translate = (value: Translation | string) =>
    deps.global.translateTasks(value)

  const before = withBefore
    ? translateAdornment(answerInput?.before, translate)
    : ''
  const after = withAfter
    ? translateAdornment(answerInput?.after, translate)
    : ''

  return (
    <div className={styles.inputWrapper} data-testid="equation-answer-row">
      {before ? (
        <TextAdornment
          data-testid="equation-before"
          className={styles.beforeText}
          value={before}
        />
      ) : null}
      {mode === 'input' ? (
        <MathInput
          ref={mathInputRef}
          formula={answer}
          onMathFieldChanged={onChange}
          className={styles.input}
        />
      ) : correctAnswer ? (
        <MathFormula className={styles.answerFormula}>
          {correctAnswer}
        </MathFormula>
      ) : null}
      {after ? (
        <TextAdornment
          data-testid="equation-after"
          className={styles.afterText}
          value={after}
        />
      ) : null}
    </div>
  )
}
