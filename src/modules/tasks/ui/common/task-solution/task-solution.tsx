import clsx from 'clsx'

import CheckIcon from '@/assets/icons/check.svg'
import CloseIcon from '@/assets/icons/close.svg'
import type { TaskSolution as TaskSolutionType } from '@/types/api/task'
import { FlexRow } from '@/ui/layout/flex-row/flex-row'
import { MathFormula } from '@/ui/math-text/math-formula'
import { MathText } from '@/ui/math-text/math-text'

import type { TaskModalDependencies } from '../../../../task-modal/model/types/props'

import s from './task-solution.module.scss'

export interface TaskSolutionProps {
  className?: string
  solution: TaskSolutionType
  answer: string
  correctAnswer: string
  deps: TaskModalDependencies
}

export const TaskSolution = ({
  className,
  solution,
  answer,
  correctAnswer,
  deps,
}: TaskSolutionProps) => {
  // console.log('solution', { solution, correctAnswer, answer })
  const content = deps.global.translateTasks(solution.content)
  return (
    <div className={clsx(s.container, className)}>
      <div className={s.highlight} style={{ alignItems: 'flex-end' }}>
        <CloseIcon className={s.icon} />
        Ваш ответ: <MathFormula className={s.answer}>{answer}</MathFormula>
      </div>

      <hr className={s.delimeter} />

      <FlexRow className={s.highlight}>
        <CheckIcon className={s.icon} />
        Правильный ответ:{' '}
        <MathText className={s.answer}>
          {deps.global.translateTasks(correctAnswer)}
        </MathText>
      </FlexRow>

      {content && (
        <>
          <p className={s.explanation}>Объяснение</p>
          <div className={s.explanationContent}>
            <MathText>{content}</MathText>
          </div>
        </>
      )}
    </div>
  )
}
