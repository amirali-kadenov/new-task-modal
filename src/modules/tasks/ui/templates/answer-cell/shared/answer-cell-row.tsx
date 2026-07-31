import type { Ref } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import { TextAdornment } from '@/modules/tasks/ui/templates/text/shared/text-adornment'
import type { Translation } from '@/types/api/task'
import { MathInput } from '@/ui/math-input/math-input'
import type { MathInputRef } from '@/ui/math-input/types'
import { MathFormula } from '@/ui/math-text/math-formula'
import { MathText } from '@/ui/math-text/math-text'

import { normalizeAnswerCellDescription } from '../lib/normalize-answer-cell-description'
import type {
  AnswerCellAnswerInput,
  AnswerCellTaskDescription,
  MultiAnswerCellAnswerInput,
  SimpleAnswerCellAnswerInput,
} from '../lib/types.task'
import styles from './answer-cell.module.scss'

export const ANSWER_CELL_TOKEN = 'answercell'

interface CellAdornments {
  before: string
  after: string
}

interface Props {
  description: AnswerCellTaskDescription
  answerInput?: AnswerCellAnswerInput
  deps: TaskModalDependencies
  answer: string
  /** Input mode: wire MathInputs. Solution mode: show MathFormula cells. */
  mode: 'input' | 'solution'
  withBefore?: boolean
  withAfter?: boolean
  /** Multi templates always use ;;-split answers and inputN adornments. */
  multi?: boolean
  setRef?: (ref: MathInputRef | null) => void
  onChange?: (value: string) => void
  mathInputRef?: (ref: MathInputRef | null) => void
}

const translateAdornment = (
  value: string | Translation | undefined,
  translate: (value: Translation | string) => string,
): string => {
  if (value == null) return ''
  if (isTranslation(value)) return translate(value)
  return typeof value === 'string' ? value : ''
}

const translateContent = (
  content: AnswerCellTaskDescription['content'],
  translate: (value: Translation | string) => string,
): string => {
  if (typeof content === 'string') return content
  if (isTranslation(content)) return translate(content)
  return ''
}

/**
 * ME-style interleave: `content.split('answercell')` → MathText + MathInput
 * pairs, last segment text-only.
 */
export const AnswerCellRow = ({
  description,
  answerInput,
  deps,
  answer,
  mode,
  withBefore = false,
  withAfter = false,
  multi = false,
  setRef,
  onChange,
  mathInputRef,
}: Props) => {
  const desc = normalizeAnswerCellDescription(
    description as unknown as Record<string, unknown>,
  ) as AnswerCellTaskDescription

  const translate = (value: Translation | string) =>
    deps.global.translateTasks(value)

  const content = translateContent(desc.content, translate)
  const parts = content.split(ANSWER_CELL_TOKEN)
  const cellCount = Math.max(0, parts.length - 1)
  const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
  const answerValues =
    multi || cellCount > 1 ? answer.split(separator) : [answer]

  const margin = desc.answerCellMargin ?? undefined
  const isColumn = Boolean(desc.isColumn)

  const adornmentsForCell = (index: number): CellAdornments => {
    if (multi) {
      const multiAi = answerInput as MultiAnswerCellAnswerInput | undefined
      const cellAi = multiAi?.[
        `input${index + 1}` as `input${number}`
      ] as SimpleAnswerCellAnswerInput | undefined
      return {
        before: withBefore
          ? translateAdornment(cellAi?.before, translate)
          : '',
        after: withAfter ? translateAdornment(cellAi?.after, translate) : '',
      }
    }
    const simple = answerInput as SimpleAnswerCellAnswerInput | undefined
    return {
      before: withBefore ? translateAdornment(simple?.before, translate) : '',
      after: withAfter ? translateAdornment(simple?.after, translate) : '',
    }
  }

  return (
    <div
      className={`${styles.contentRow} ${isColumn ? styles.contentRowColumn : ''}`}
      data-testid="answer-cell-row"
      data-cell-count={cellCount}
    >
      {parts.map((segment, index) => {
        const isLast = index === cellCount
        if (isLast) {
          return segment ? (
            <MathText key={`seg-${index}`}>{segment}</MathText>
          ) : null
        }

        const { before, after } = adornmentsForCell(index)
        const cellValue = answerValues[index] ?? ''
        const inputId = multi ? `input${index + 1}` : undefined

        return (
          <div key={`cell-${index}`} className={styles.segment}>
            {segment ? <MathText>{segment}</MathText> : null}
            {before ? (
              <TextAdornment
                data-testid="text-prefix"
                className={styles.prefix}
                value={before}
              />
            ) : null}
            {mode === 'input' ? (
              <MathInput
                id={inputId}
                ref={(multi ? setRef : mathInputRef) as Ref<MathInputRef>}
                formula={cellValue}
                onMathFieldChanged={onChange}
                className={styles.cellInput}
                style={margin ? { margin } : undefined}
              />
            ) : (
              <MathFormula
                className={`${styles.answerFormula} ${styles.solutionRow}`}
              >
                {cellValue}
              </MathFormula>
            )}
            {after ? (
              <TextAdornment
                data-testid="text-suffix"
                className={styles.suffix}
                value={after}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
