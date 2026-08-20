import clsx from 'clsx'

import { MathFormula } from '@/ui/math-text/math-formula'

import type { DivisionCornerParts } from '../lib/parse-division-corner'

import styles from './column-operation.module.scss'

type Props = DivisionCornerParts & {
  className?: string
  /** Solution view: division-with-remainder — show under the quotient. */
  remainder?: string
}

/** School «уголок» via HTML/CSS — top-aligned digits, stable paddings. */
export const DivisionCorner = ({
  dividend,
  divisor,
  quotient,
  remainder,
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
      {remainder !== undefined && (
        <div className={styles.cornerRemainder}>
          <MathFormula>{remainder}</MathFormula>
        </div>
      )}
    </div>
  </div>
)
