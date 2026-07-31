import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import type { Translation } from '@/types/api/task'
import { MathText } from '@/ui/math-text/math-text'

import type { ComplexTextPart } from '../../lib/types.task'
import styles from '../complex.module.scss'

interface Props {
  part: ComplexTextPart
  deps: TaskModalDependencies
}

export const TextPart = ({ part, deps }: Props) => {
  const text =
    typeof part.content === 'string'
      ? part.content
      : deps.global.translateTasks(part.content as Translation)

  if (!text) return null

  return (
    <div className={styles.textPart} data-figure-type="10">
      <MathText>{text}</MathText>
    </div>
  )
}
