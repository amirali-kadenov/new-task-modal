import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import type { Translation } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'
import type { MathInputRef } from '@/ui/math-input/types'
import { MathFormula } from '@/ui/math-text/math-formula'
import { MathText } from '@/ui/math-text/math-text'

import { formatComparisonSide } from '../lib/format-comparison-side'
import { normalizeComparisonDescription } from '../lib/normalize-comparison-description'
import type { ComparisonTaskDescription } from '../lib/types.task'
import styles from './comparison.module.scss'

interface Props {
  description: ComparisonTaskDescription
  deps: TaskModalDependencies
  answer: string
  mode: 'input' | 'solution'
  onChange?: (value: string) => void
  mathInputRef?: (ref: MathInputRef | null) => void
}

/** ME/old layout: first | MathInput | second (+ optional svg1/svg2). */
export const ComparisonRow = ({
  description,
  deps,
  answer,
  mode,
  onChange,
  mathInputRef,
}: Props) => {
  const desc = normalizeComparisonDescription(
    description as unknown as Record<string, unknown>,
  ) as ComparisonTaskDescription

  const translate = (value: Translation | string) =>
    deps.global.translateTasks(value)

  const first = formatComparisonSide(desc.first, translate)
  const second = formatComparisonSide(desc.second, translate)
  const svg1 =
    typeof desc.svg1 === 'string' && desc.svg1.trim() ? desc.svg1 : ''
  const svg2 =
    typeof desc.svg2 === 'string' && desc.svg2.trim() ? desc.svg2 : ''

  return (
    <div className={styles.container} data-testid="comparison-row">
      {svg1 ? (
        <div
          className={styles.svgSide}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: svg1 }}
        />
      ) : null}
      <div className={styles.side} data-testid="comparison-first">
        <MathText>{first}</MathText>
      </div>

      {mode === 'input' ? (
        <MathInput
          ref={mathInputRef}
          formula={answer}
          onMathFieldChanged={onChange}
          className={styles.input}
        />
      ) : (
        <MathFormula className={styles.answerFormula}>{answer}</MathFormula>
      )}

      <div className={styles.side} data-testid="comparison-second">
        <MathText>{second}</MathText>
      </div>
      {svg2 ? (
        <div
          className={styles.svgSide}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: svg2 }}
        />
      ) : null}
    </div>
  )
}
