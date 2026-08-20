import type { ReactNode } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { stripMathDelimiters } from '@/modules/tasks/ui/templates/text/lib/strip-math-delimiters'
import { TextAdornment } from '@/modules/tasks/ui/templates/text/shared/text-adornment'
import { MathFormula } from '@/ui/math-text/math-formula'
import { MathText } from '@/ui/math-text/math-text'
import { useAnswerTruncation } from '@/ui/math-text/use-answer-truncation'

import s from './chat-answer-panel.module.scss'

interface Props {
  userAnswer: string
  correctAnswer: string
  /**
   * `answerInput.after` unit (e.g. "л") — rendered as a plain sibling next
   * to the answer, never concatenated into the math string (MathFormula
   * wraps its whole child in one `\(...\)` island; Cyrillic text inside
   * math mode renders italicized/broken).
   */
  unit?: string
  deps: TaskModalDependencies
}

const AnswerRow = ({
  label,
  text,
  unit,
  renderAnswer,
}: {
  label: string
  text: string
  unit?: string
  renderAnswer: (text: string, onTypesetDone: () => void) => ReactNode
}) => {
  const { rowRef, displayText, truncated, onTypesetDone } = useAnswerTruncation(
    s.answer,
    text,
  )

  return (
    <div ref={rowRef} className={s.row}>
      <span className={s.label}>{label}</span>
      {renderAnswer(displayText, onTypesetDone)}
      {truncated && (
        <span className={s.ellipsis} aria-hidden="true">
          …
        </span>
      )}
      {unit ? (
        <TextAdornment
          data-testid="answer-unit"
          className={s.unit}
          value={unit}
        />
      ) : null}
    </div>
  )
}

/**
 * Flat, icon-free answer row for the AI-chat solution bubble.
 * Deliberately duplicated from `SolutionAnswerPanel` (task-solution) instead
 * of reusing it — that component is shared with the regular task-modal
 * solution view and must keep its current (icon/highlight) look there.
 */
export const ChatAnswerPanel = ({
  userAnswer,
  correctAnswer,
  unit,
  deps,
}: Props) => {
  const showUser = Boolean(userAnswer?.trim())
  const showCorrect = Boolean(correctAnswer?.trim())

  if (!showUser && !showCorrect) {
    return null
  }

  const correctLabel = deps.global.translateTasks(correctAnswer)

  return (
    <div className={s.container}>
      {showUser && (
        <AnswerRow
          label="Ваш ответ:"
          text={stripMathDelimiters(userAnswer)}
          unit={unit}
          renderAnswer={(text, onTypesetDone) => (
            <MathFormula className={s.answer} onTypeset={onTypesetDone}>
              {text}
            </MathFormula>
          )}
        />
      )}

      {showCorrect && (
        <AnswerRow
          label="Верный ответ:"
          text={correctLabel}
          unit={unit}
          renderAnswer={(text, onTypesetDone) => (
            <MathText inline className={s.answer} onTypeset={onTypesetDone}>
              {text}
            </MathText>
          )}
        />
      )}
    </div>
  )
}
