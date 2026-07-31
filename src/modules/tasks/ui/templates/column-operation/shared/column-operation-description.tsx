import clsx from 'clsx'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { getDescriptionTranslation } from '@/modules/tasks/ui/common/task-description/model/get-description-translation'
import type { Task } from '@/types/api/task'
import { MathFormula } from '@/ui/math-text/math-formula'
import { MathText } from '@/ui/math-text/math-text'

import { parseDivisionCorner } from '../lib/parse-division-corner'
import { prepareColumnOperationMath } from '../lib/prepare-column-operation-math'
import type { ColumnOperationTask } from '../lib/types.task'
import { DivisionCorner } from './division-corner'

import styles from './column-operation.module.scss'

interface Props {
  task: ColumnOperationTask
  deps: TaskModalDependencies
  className?: string
  /** Solution view: show this under the division hline. */
  quotient?: string
}

/**
 * ColumnOperation description: CIS division uses HTML «уголок»;
 * +/−/× (and unparseable tex) go through MathFormula / MathText.
 */
export const ColumnOperationDescription = ({
  task,
  deps,
  className,
  quotient,
}: Props) => {
  const raw = getDescriptionTranslation(
    task as unknown as Task<'columnOperation'>,
    deps,
  )

  if (!raw?.trim()) return null

  const classNames = clsx(styles.description, className)
  const corner = parseDivisionCorner(raw, { quotient })

  if (corner) {
    return (
      <DivisionCorner
        className={classNames}
        dividend={corner.dividend}
        divisor={corner.divisor}
        quotient={corner.quotient}
      />
    )
  }

  const text = prepareColumnOperationMath(raw)

  if (!text) return null

  const needsFormulaWrap = text.includes('\\begin{') && !text.includes('\\(')

  if (needsFormulaWrap) {
    return <MathFormula className={classNames}>{text}</MathFormula>
  }

  return <MathText className={classNames}>{text}</MathText>
}
