import CheckIcon from '@/assets/icons/check.svg'
import CloseIcon from '@/assets/icons/close.svg'
import { FlexRow } from '@/ui/layout/flex-row/flex-row'
import { MathFormula } from '@/ui/math-text/math-formula'
import { MathText } from '@/ui/math-text/math-text'

import type { TaskModalDependencies } from '../../../task-modal/model/types/props'

import s from './solution-answer-panel.module.scss'

interface Props {
  userAnswer: string
  correctAnswer: string
  correctLabel?: string
  deps: TaskModalDependencies
}

export const SolutionAnswerPanel = ({
  userAnswer,
  correctAnswer,
  correctLabel,
  deps,
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
        <div className={s.highlight}>
          <CloseIcon className={s.icon} />
          <span className={s.label}>Ваш ответ:</span>
          <MathFormula className={s.answer}>{userAnswer}</MathFormula>
        </div>
      )}

      {showUser && showCorrect && <hr className={s.delimeter} />}

      {showCorrect && (
        <FlexRow className={s.highlight}>
          <CheckIcon className={s.icon} />
          <span className={s.label}>Правильный ответ:</span>
          <MathText inline className={s.answer}>
            {resolvedCorrectLabel}
          </MathText>
        </FlexRow>
      )}
    </div>
  )
}
