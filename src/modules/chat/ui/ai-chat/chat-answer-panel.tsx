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

/**
 * User's (often wrong) answer — can be arbitrarily long garbage input, so
 * it's truncated with an ellipsis instead of wrapping/overflowing the row.
 */
const UserAnswerRow = ({ text, unit }: { text: string; unit?: string }) => {
  const { rowRef, displayText, truncated, onTypesetDone } = useAnswerTruncation(
    s.userAnswer,
    text,
  )

  return (
    <div ref={rowRef} className={s.row}>
      <span className={s.label}>Ваш ответ:</span>
      <MathFormula className={s.userAnswer} onTypeset={onTypesetDone}>
        {displayText}
      </MathFormula>
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
 * Correct answer — must never be truncated, only wrap. `table_13`-style
 * multi-cell answers (joined with `;;`) can be long enough to overflow the
 * narrow chat bubble; clipping it would show the pupil a wrong answer.
 */
const CorrectAnswerRow = ({ text, unit }: { text: string; unit?: string }) => (
  <div className={s.row}>
    <span className={s.label}>Верный ответ:</span>
    <MathText inline className={s.correctAnswer}>
      {text}
    </MathText>
    {unit ? (
      <TextAdornment
        data-testid="answer-unit"
        className={s.unit}
        value={unit}
      />
    ) : null}
  </div>
)

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
        <UserAnswerRow text={stripMathDelimiters(userAnswer)} unit={unit} />
      )}

      {showCorrect && <CorrectAnswerRow text={correctLabel} unit={unit} />}
    </div>
  )
}
