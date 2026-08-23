import clsx from 'clsx'

import CheckIcon from '@/assets/icons/check.svg'
import CloseIcon from '@/assets/icons/close.svg'
import { TextAdornment } from '@/modules/tasks/ui/templates/text/shared/text-adornment'
import { MathFormula } from '@/ui/math-text/math-formula'
import { MathText } from '@/ui/math-text/math-text'
import { useAnswerTruncation } from '@/ui/math-text/use-answer-truncation'

import type { TaskModalDependencies } from '../../../../task-modal/model/types/props'

import s from './solution-answer-panel.module.scss'

interface Props {
  userAnswer: string
  correctAnswer: string
  correctLabel?: string
  /**
   * `answerInput.after` unit (e.g. "л") — rendered as a plain sibling next
   * to the answer, never concatenated into the math string (MathFormula
   * wraps its whole child in one `\(...\)` island; Cyrillic text inside
   * math mode renders italicized/broken).
   */
  unit?: string
  deps: TaskModalDependencies
  /** Center the icon/label/answer row instead of the default end-alignment. */
  alignCenter?: boolean
}

/**
 * User's (often wrong) answer — can be arbitrarily long garbage input, so
 * unlike the correct answer it's truncated with an ellipsis instead of
 * wrapping/overflowing the row.
 */
const UserAnswerHighlight = ({
  text,
  unit,
  alignCenter,
}: {
  text: string
  unit?: string
  alignCenter?: boolean
}) => {
  const { rowRef, displayText, truncated, onTypesetDone } = useAnswerTruncation(
    s.userAnswer,
    text,
  )

  return (
    <div
      ref={rowRef}
      data-testid="user-answer-highlight"
      className={clsx(s.highlight, alignCenter && s.highlightCenter)}
    >
      <CloseIcon className={s.icon} />
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

export const SolutionAnswerPanel = ({
  userAnswer,
  correctAnswer,
  correctLabel,
  unit,
  deps,
  alignCenter,
}: Props) => {
  const showUser = Boolean(userAnswer?.trim())
  const showCorrect = Boolean(correctAnswer?.trim())

  if (!showUser && !showCorrect) {
    return null
  }

  const resolvedCorrectLabel =
    correctLabel ?? deps.global.translateTasks(correctAnswer)

  return (
    <div className={s.container}>
      {showUser && (
        <UserAnswerHighlight
          text={userAnswer}
          unit={unit}
          alignCenter={alignCenter}
        />
      )}

      {showUser && showCorrect && <hr className={s.delimeter} />}

      {showCorrect && (
        <div className={clsx(s.highlight, alignCenter && s.highlightCenter)}>
          <CheckIcon className={s.icon} />
          <span className={s.label}>Правильный ответ:</span>
          <MathText inline className={s.answer}>
            {resolvedCorrectLabel}
          </MathText>
          {unit ? (
            <TextAdornment
              data-testid="answer-unit"
              className={s.unit}
              value={unit}
            />
          ) : null}
        </div>
      )}
    </div>
  )
}
