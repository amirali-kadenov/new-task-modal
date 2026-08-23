import clsx from 'clsx'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'
import { isTranslation } from '@/modules/tasks/lib/translation-utils'
import { stripEmptyMathIslands } from '@/modules/tasks/ui/templates/text/lib/strip-empty-math-islands'
import { stripMathDelimiters } from '@/modules/tasks/ui/templates/text/lib/strip-math-delimiters'
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
  bindRef?: (id: string) => (ref: MathInputRef | null) => void
  setRef?: (ref: MathInputRef | null) => void
  onChange?: (value: string) => void
  mathInputRef?: (ref: MathInputRef | null) => void
  /** Elixir module id, e.g. `Elixir.Task_4_1_66` — dev-warning context only. */
  taskType?: string
  /** Extra class merged onto each input cell, for templates needing a non-default width. */
  cellInputClassName?: string
  /** Keep solution-mode content row centered instead of the default end-alignment. */
  solutionAlignCenter?: boolean
}

const warnedAdornmentMismatches = new Set<string>()

/**
 * Dev-only: the chapter routing map (`ui/grades/**`) can assign a task to a
 * template whose `withBefore`/`withAfter` doesn't match what the backend
 * actually sends — see the `answerCell.plain` vs `.after` mismatch found for
 * `Task_4_6_10_23`/`_10_28`/`Task_4_7_1_15`. Surface it in dev instead of
 * silently dropping the adornment.
 */
const warnIfAdornmentHidden = (
  taskType: string | undefined,
  kind: 'before' | 'after',
  value: string,
  supported: boolean,
): void => {
  if (!import.meta.env.DEV || supported || !value) return
  const key = `${taskType ?? 'unknown'}:${kind}`
  if (warnedAdornmentMismatches.has(key)) return
  warnedAdornmentMismatches.add(key)
  console.warn(
    `AnswerCellRow: task ${taskType ?? '(unknown type)'} has a non-empty "${kind}" adornment but its assigned template doesn't render "${kind}" — check the grade/chapter routing map in ui/grades/.`,
  )
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
  bindRef,
  setRef,
  onChange,
  mathInputRef,
  taskType,
  cellInputClassName,
  solutionAlignCenter = false,
}: Props) => {
  const desc = normalizeAnswerCellDescription(
    description as unknown as Record<string, unknown>,
  ) as AnswerCellTaskDescription

  const translate = (value: Translation | string) =>
    deps.global.translateTasks(value)

  const content = stripEmptyMathIslands(
    translateContent(desc.content, translate),
  )
  const parts = content.split(ANSWER_CELL_TOKEN)
  const cellCount = Math.max(0, parts.length - 1)
  const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator
  const answerValues =
    multi || cellCount > 1 ? splitMultiAnswer(answer, separator) : [answer]

  const margin = desc.answerCellMargin ?? undefined
  const isColumn = Boolean(desc.isColumn)

  const adornmentsForCell = (index: number): CellAdornments => {
    const source = multi
      ? (answerInput as MultiAnswerCellAnswerInput | undefined)?.[
          `input${index + 1}`
        ]
      : (answerInput as SimpleAnswerCellAnswerInput | undefined)

    const before = translateAdornment(source?.before, translate)
    const after = translateAdornment(source?.after, translate)

    warnIfAdornmentHidden(taskType, 'before', before, withBefore)
    warnIfAdornmentHidden(taskType, 'after', after, withAfter)

    return {
      before: withBefore ? before : '',
      after: withAfter ? after : '',
    }
  }

  return (
    <div
      className={clsx(
        styles.contentRow,
        mode === 'solution' &&
          !solutionAlignCenter &&
          styles.contentRowSolution,
        isColumn && styles.contentRowColumn,
      )}
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
        // MathFormula always wraps `\(...\)`; strip wire delimiters in solution mode.
        const solutionCellValue =
          mode === 'solution' ? stripMathDelimiters(cellValue) : cellValue
        const inputId = multi ? `input${index + 1}` : undefined

        return (
          <div
            key={`cell-${index}`}
            className={clsx(
              styles.segment,
              mode === 'solution' && styles.segmentSolution,
              mode === 'input' && styles.segmentInput,
            )}
          >
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
                ref={
                  multi
                    ? inputId && bindRef
                      ? bindRef(inputId)
                      : setRef
                    : mathInputRef
                }
                formula={cellValue}
                onMathFieldChanged={onChange}
                className={clsx(styles.cellInput, cellInputClassName)}
                style={margin ? { margin } : undefined}
              />
            ) : (
              <MathFormula className={styles.answerFormula}>
                {solutionCellValue}
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
