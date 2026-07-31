import clsx from 'clsx'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { getDescriptionTranslation } from '@/modules/tasks/ui/common/task-description/model/get-description-translation'
import type { Task } from '@/types/api/task'
import { MathFormula } from '@/ui/math-text/math-formula'

import type { FormulaTask } from '../lib/types.task'

import styles from './formula.module.scss'

interface Props {
  task: FormulaTask
  deps: TaskModalDependencies
  className?: string
}

/** Formula description: always inline math (`10000 + 3 = `), no `\begin{array}` block. */
export const FormulaDescription = ({ task, deps, className }: Props) => {
  const text = getDescriptionTranslation(
    task as unknown as Task<'formula'>,
    deps,
  )

  if (!text) return null

  return (
    <MathFormula className={clsx(styles.description, className)}>
      {text}
    </MathFormula>
  )
}
