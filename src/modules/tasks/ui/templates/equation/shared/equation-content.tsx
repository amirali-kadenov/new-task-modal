import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { MathText } from '@/ui/math-text/math-text'

import styles from './equation.module.scss'
import type { EquationTaskDescription } from './lib/types.task'

interface Props {
  description: EquationTaskDescription
  deps: TaskModalDependencies
}

/** Equation body (`description.content`). */
export const EquationContent = ({ description, deps }: Props) => {
  const text = deps.global.translateTasks(description.content)
  if (!text.trim()) return null

  return (
    <div className={styles.content} data-testid="equation-content">
      <MathText>{text}</MathText>
    </div>
  )
}
