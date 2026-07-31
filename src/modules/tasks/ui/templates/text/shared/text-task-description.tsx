import clsx from 'clsx'

import { useAudioStore } from '@/modules/audio/model/audio-store'
import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { getDescriptionTranslation } from '@/modules/tasks/ui/common/task-description/model/get-description-translation'
import descriptionStyles from '@/modules/tasks/ui/common/task-description/ui/task-description.module.scss'
import type { Task } from '@/types/api/task'
import type { TaskDescriptionType } from '@/types/enums'
import { MathText } from '@/ui/math-text/math-text'
import { normalizeFractionStyle } from '@/ui/math-text/normalize-fraction-style'

import { maybeNormalizeBareMath } from '../lib/normalize-bare-math'
import { uprightMathUnits } from '../lib/upright-math-units'

interface Props<T extends TaskDescriptionType> {
  task: Task<T>
  deps: TaskModalDependencies
  className?: string
  /** When true, wrap bare `unit^n` for MathJax (see `normalizeBareMath`). */
  normalizeBareMath?: boolean
}

/** TaskDescription for text templates with optional bare-math normalize. */
export const TextTaskDescription = <T extends TaskDescriptionType>({
  task,
  deps,
  className,
  normalizeBareMath: shouldNormalize = false,
}: Props<T>) => {
  const progress = useAudioStore((state) => state.progress)
  const text = normalizeFractionStyle(
    uprightMathUnits(
      maybeNormalizeBareMath(
        getDescriptionTranslation(task, deps),
        shouldNormalize,
      ),
    ),
  )

  return (
    <MathText className={clsx(descriptionStyles.container, className)}>
      {progress ? <ProgressText text={text} progress={progress} /> : text}
    </MathText>
  )
}

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
      <span className={descriptionStyles.highlighted}>{highlighted}</span>
      <span className={descriptionStyles.remaining}>{remaining}</span>
    </>
  )
}
