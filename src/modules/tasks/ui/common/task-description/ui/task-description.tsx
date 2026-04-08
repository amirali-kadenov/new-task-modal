import clsx from 'clsx'

import { useAudioStore } from '@/modules/audio/model/audio-store'
import type { Task } from '@/types/api/task'
import type { TaskDescriptionType } from '@/types/enums'
import { MathText } from '@/ui/math-text/math-text'

import type { TaskModalDependencies } from '../../../../../task-modal/model/types/props'
import { getDescriptionTranslation } from '../model/get-description-translation'

import styles from './task-description.module.scss'

interface Props<T extends TaskDescriptionType> {
  task: Task<T>
  deps: TaskModalDependencies
  className?: string
}

export const TaskDescription = <T extends TaskDescriptionType>({
  task,
  deps,
  className,
}: Props<T>) => {
  const progress = useAudioStore((state) => state.progress)
  const text = getDescriptionTranslation(task, deps)

  return (
    <MathText className={clsx(styles.container, className)}>
      {progress ? <ProgressText text={text} progress={progress} /> : text}
    </MathText>
  )
}

// ProgressText

interface ProgressTextProps {
  text: string
  progress: number
}

const ProgressText = ({ text, progress }: ProgressTextProps) => {
  const highlightedLen = Math.floor(text.length * progress)
  const highlighted = text.slice(0, highlightedLen)
  const remaining = text.slice(highlightedLen)

  return (
    <>
      <span className={styles.highlighted}>{highlighted}</span>
      <span className={styles.remaining}>{remaining}</span>
    </>
  )
}
