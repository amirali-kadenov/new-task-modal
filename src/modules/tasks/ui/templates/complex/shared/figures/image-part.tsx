import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import type { Translation } from '@/types/api/task'

import type { ComplexImagePart } from '../../lib/types.task'
import styles from '../complex.module.scss'

interface Props {
  part: ComplexImagePart
  deps: TaskModalDependencies
}

const htmlFromContent = (
  content: ComplexImagePart['content'],
  deps: TaskModalDependencies,
): string => {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) return ''
  return deps.global.translateTasks(content as Translation)
}

/** Display-only image / SVG part (no countable click UI for grade 4). */
export const ImagePart = ({ part, deps }: Props) => {
  const repeat = Math.max(1, Number(part.repeatQuantity) || 1)
  const backgroundImage = part.backgroundImage ?? null
  const size =
    typeof part.manuallySetSize === 'number'
      ? part.manuallySetSize
      : part.size

  if (Array.isArray(part.content)) {
    return (
      <div className={styles.imageOverlay} data-figure-type="160">
        {backgroundImage ? (
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: backgroundImage }}
          />
        ) : null}
        <div className={styles.imagePart}>
          {part.content.map((item, index) => (
            <div
              key={index}
              style={
                size
                  ? { width: size, height: size }
                  : undefined
              }
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </div>
      </div>
    )
  }

  const html = htmlFromContent(part.content, deps)
  if (!html) return null

  return (
    <div className={styles.imagePart} data-figure-type="160">
      {Array.from({ length: repeat }, (_, index) => (
        <div
          key={index}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ))}
    </div>
  )
}
