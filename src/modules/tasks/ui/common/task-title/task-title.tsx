import type { Translation } from '@/types/api/api'
import { MathText } from '@/ui/math-text/math-text'

import type { TaskModalDependencies } from '../../../task-modal/model/types/props'

import styles from './task-title.module.scss'

interface Props {
  title: Translation | string | null | undefined
  deps: TaskModalDependencies
}

export const TaskTitle = ({ title, deps }: Props) => {
  if (!title) return null

  const text = deps.global.translateTasks(title)

  if (!text.trim()) return null

  return <MathText className={styles.title}>{text}</MathText>
}
