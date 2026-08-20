import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { Translation } from '@/types/api/task'
import { MathText } from '@/ui/math-text/math-text'

import { normalizeAnswerCellDescription } from '../lib/normalize-answer-cell-description'
import type { AnswerCellTaskDescription } from '../lib/types.task'

import styles from './answer-cell.module.scss'

interface Props {
  description: AnswerCellTaskDescription
  deps: TaskModalDependencies
}

const translateOptional = (
  value: Translation | string | null | undefined,
  translate: (value: Translation | string) => string,
): string => {
  if (value == null || value === '') return ''
  if (isTranslation(value)) return translate(value)
  return typeof value === 'string' ? value : ''
}

/** Optional textBefore / textAfter / imageBefore above the answer-cell row. */
export const AnswerCellDescriptionExtras = ({ description, deps }: Props) => {
  const desc = normalizeAnswerCellDescription(
    description as unknown as Record<string, unknown>,
  ) as AnswerCellTaskDescription

  const translate = (value: Translation | string) =>
    deps.global.translateTasks(value)

  const textBefore = translateOptional(desc.textBefore, translate)
  const textAfter = translateOptional(desc.textAfter, translate)
  const imageBefore =
    typeof desc.imageBefore === 'string' && desc.imageBefore.trim()
      ? desc.imageBefore
      : ''

  return (
    <>
      {textBefore ? (
        <MathText className={styles.textBefore}>{textBefore}</MathText>
      ) : null}
      {imageBefore ? (
        <div
          className={styles.imageBefore}
          dangerouslySetInnerHTML={{ __html: imageBefore }}
        />
      ) : null}
      {textAfter ? (
        <MathText className={styles.textAfter}>{textAfter}</MathText>
      ) : null}
    </>
  )
}
