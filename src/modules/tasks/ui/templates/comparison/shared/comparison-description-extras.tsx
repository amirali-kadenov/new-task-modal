import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import type { Translation } from '@/types/api/task'
import { MathText } from '@/ui/math-text/math-text'

import { normalizeComparisonDescription } from '../lib/normalize-comparison-description'
import type { ComparisonTaskDescription } from '../lib/types.task'

import styles from './comparison.module.scss'

interface Props {
  description: ComparisonTaskDescription
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

/** Optional textBefore / imageBefore / images / textAfter above the row. */
export const ComparisonDescriptionExtras = ({ description, deps }: Props) => {
  const desc = normalizeComparisonDescription(
    description as unknown as Record<string, unknown>,
  ) as ComparisonTaskDescription

  const translate = (value: Translation | string) =>
    deps.global.translateTasks(value)

  const textBefore = translateOptional(desc.textBefore, translate)
  const textAfter = translateOptional(desc.textAfter, translate)
  const imageBefore =
    typeof desc.imageBefore === 'string' && desc.imageBefore.trim()
      ? desc.imageBefore
      : ''
  const images = Array.isArray(desc.images)
    ? desc.images.filter((item) => typeof item === 'string' && item.trim())
    : []

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
      {images.length > 0 ? (
        <div className={styles.images}>
          {images.map((html, index) => (
            <div key={index} dangerouslySetInnerHTML={{ __html: html }} />
          ))}
        </div>
      ) : null}
      {textAfter ? (
        <MathText className={styles.textAfter}>{textAfter}</MathText>
      ) : null}
    </>
  )
}
