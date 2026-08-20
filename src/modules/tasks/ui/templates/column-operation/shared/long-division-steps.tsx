import { MathFormula } from '@/ui/math-text/math-formula'

import {
  computeLongDivisionSteps,
  renderBringDown,
} from '../lib/compute-long-division-steps'

import styles from './column-operation.module.scss'
import { DivisionCorner } from './division-corner'

interface Props {
  dividend: number
  divisor: number
  className?: string
}

/**
 * Full worked long-division example: уголок (dividend | divisor, quotient)
 * plus the bring-down/subtract steps below it, computed client-side from
 * `dividend`/`divisor` — replaces feeding an opaque CMS text/LaTeX blob into
 * MathJax for this content (fragile: mismatched `\(`/`\[` delimiters in that
 * blob render as visible MathJax errors).
 *
 * Matches the reference (matheducator) layout: the dividend stays a single
 * number (same `DivisionCorner` used for the plain question-view corner);
 * each step is simply indented by its digit position (`columnStart`) rather
 * than aligned to a shared character grid — the reference itself is only
 * approximately column-aligned, not pixel-exact.
 */
export const LongDivisionSteps = ({ dividend, divisor, className }: Props) => {
  const { steps, quotient, remainder } = computeLongDivisionSteps(
    dividend,
    divisor,
  )

  const corner = (
    <DivisionCorner
      dividend={String(dividend)}
      divisor={String(divisor)}
      quotient={String(quotient)}
    />
  )

  if (steps.length === 0) {
    return <div className={className}>{corner}</div>
  }

  const lastStep = steps[steps.length - 1]

  return (
    <div className={className}>
      {corner}
      <div className={styles.longDivisionSteps}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={styles.stepGroup}
            data-testid="long-division-step-group"
            style={{ marginLeft: `${step.columnStart}ch` }}
          >
            {step.showBringDown && (
              <div className={styles.stepCurrent}>
                <MathFormula>{renderBringDown(steps, index)}</MathFormula>
              </div>
            )}
            <div className={styles.stepSubtrahend}>
              <span className={styles.stepMinus}>−</span>
              <MathFormula>{String(step.subtrahend)}</MathFormula>
            </div>
          </div>
        ))}
        <div
          className={styles.stepRemainder}
          style={{ marginLeft: `${lastStep.columnStart}ch` }}
        >
          <MathFormula>{String(remainder)}</MathFormula>
        </div>
      </div>
    </div>
  )
}
