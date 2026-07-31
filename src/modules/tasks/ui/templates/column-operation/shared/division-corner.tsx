import clsx from 'clsx'

import { MathFormula } from '@/ui/math-text/math-formula'

import type { DivisionCornerParts } from '../lib/parse-division-corner'

import styles from './column-operation.module.scss'

type Props = DivisionCornerParts & {
  className?: string
}

/** School «уголок» via HTML/CSS — top-aligned digits, stable paddings. */
export const DivisionCorner = ({
  dividend,
  divisor,
  quotient,
  className,
}: Props) => (
  <div className={clsx(styles.corner, className)}>
    <div className={styles.cornerDividend}>
      <MathFormula>{dividend}</MathFormula>
    </div>
    <div className={styles.cornerRight}>
      <div className={styles.cornerDivisor}>
        <MathFormula>{divisor}</MathFormula>
      </div>
      {quotient !== undefined && (
        <div className={styles.cornerQuotient}>
          <MathFormula>{quotient}</MathFormula>
        </div>
      )}
    </div>
  </div>
)
