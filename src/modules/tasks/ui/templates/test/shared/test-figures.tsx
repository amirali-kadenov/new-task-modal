import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { FigureType } from '@/modules/tasks/ui/templates/complex/lib/figure-types'
import { normalizeComplexPart } from '@/modules/tasks/ui/templates/complex/lib/normalize-complex-part'
import type {
  ComplexAngleListPart,
  ComplexImagePart,
  ComplexTextPart,
} from '@/modules/tasks/ui/templates/complex/lib/types.task'
import { AngleListPart } from '@/modules/tasks/ui/templates/complex/shared/figures/angle-list-part'
import { ImagePart } from '@/modules/tasks/ui/templates/complex/shared/figures/image-part'
import { TextPart } from '@/modules/tasks/ui/templates/complex/shared/figures/text-part'

import type { TestTaskDescription } from '../lib/types.task'

import styles from './test.module.scss'

interface Props {
  description: TestTaskDescription
  deps: TaskModalDependencies
}

/** Display-only figures / images above the radio options. */
export const TestFigures = ({ description, deps }: Props) => {
  const images = Array.isArray(description.images)
    ? description.images.filter(
        (item) => typeof item === 'string' && item.trim(),
      )
    : []
  const figures = Array.isArray(description.figures) ? description.figures : []
  const vertical = Boolean(description.isFiguresVertical)

  if (!images.length && !figures.length && !description.background) {
    return null
  }

  return (
    <div
      className={`${styles.figures} ${vertical ? styles.figuresVertical : ''}`}
      data-testid="test-figures"
    >
      {description.background ? (
        <div dangerouslySetInnerHTML={{ __html: description.background }} />
      ) : null}
      {images.length > 0 ? (
        <div className={styles.images}>
          {images.map((html, index) => (
            <div key={index} dangerouslySetInnerHTML={{ __html: html }} />
          ))}
        </div>
      ) : null}
      {figures.map((raw, index) => {
        const part = normalizeComplexPart(raw as Record<string, unknown>) as {
          type: number
          [key: string]: unknown
        }
        const type = Number(part.type)

        switch (type) {
          case FigureType.Text:
            return (
              <TextPart
                key={index}
                part={part as ComplexTextPart}
                deps={deps}
              />
            )
          case FigureType.Image:
            return (
              <ImagePart
                key={index}
                part={part as ComplexImagePart}
                deps={deps}
              />
            )
          case FigureType.AngleList:
            return (
              <AngleListPart key={index} part={part as ComplexAngleListPart} />
            )
          default:
            return (
              <p key={index} className={styles.unsupported}>
                Unsupported figure type {type}
              </p>
            )
        }
      })}
    </div>
  )
}
