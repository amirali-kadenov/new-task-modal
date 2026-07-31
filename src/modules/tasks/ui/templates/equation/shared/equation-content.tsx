import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import type { Translation } from '@/types/api/task'
import { MathText } from '@/ui/math-text/math-text'

import type { EquationTaskDescription } from './lib/types.task'
import styles from './equation.module.scss'

interface Props {
  description: EquationTaskDescription
  deps: TaskModalDependencies
}

/** Equation body (`description.content`). */
export const EquationContent = ({ description, deps }: Props) => {
  const text = deps.global.translateTasks(
    description.content as Translation | string,
  )
  if (!text.trim()) return null

  return (
    <div className={styles.content} data-testid="equation-content">
      <MathText>{text}</MathText>
    </div>
  )
}
