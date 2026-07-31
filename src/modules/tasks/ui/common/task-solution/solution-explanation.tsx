import clsx from 'clsx'

import type { TaskSolution as TaskSolutionType } from '@/types/api/task'
import { MathText } from '@/ui/math-text/math-text'

import {
  isComplexSolution,
  isFormulaStringSolution,
  type TaskSolutionValue,
} from '../../../lib/solution-types'
import type { TaskModalDependencies } from '../../../task-modal/model/types/props'

import { ComplexSolutionParts } from './complex-solution-parts'
import { SolutionContentText } from './solution-content-text'

import s from './solution-explanation.module.scss'

interface Props {
  solution: TaskSolutionValue
  deps: TaskModalDependencies
}

const renderTextContent = (content: string) => (
  <SolutionContentText content={content} formulaClassName={s.formula} />
)

export const SolutionExplanation = ({ solution, deps }: Props) => {
  if (typeof solution === 'object' && solution !== null && solution.error) {
    const errorText =
      typeof solution.error === 'string'
        ? solution.error
        : deps.global.translateTasks(solution.error)
    return (
      <div className={s.container}>
        <MathText inline>{errorText}</MathText>
      </div>
    )
  }

  if (isFormulaStringSolution(solution)) {
    return (
      <div className={s.container}>
        <p className={s.title}>Объяснение</p>
        {renderTextContent(solution)}
      </div>
    )
  }

  if (typeof solution !== 'object' || solution === null) {
    return null
  }

  const simpleContent =
    !isComplexSolution(solution) &&
    solution.content &&
    (typeof solution.content === 'string'
      ? solution.content
      : deps.global.translateTasks(solution.content))

  const hasComplex = isComplexSolution(solution)
  const hasSimple = Boolean(
    typeof simpleContent === 'string' && simpleContent.trim(),
  )

  if (!hasComplex && !hasSimple) {
    return null
  }

  return (
    <div className={s.container}>
      <p className={s.title}>Объяснение</p>

      {hasComplex && (
        <ComplexSolutionParts parts={solution.parts} deps={deps} />
      )}

      {hasSimple && (
        <div className={clsx(s.textBlock, hasComplex && s.textAfterComplex)}>
          {renderTextContent(simpleContent as string)}
        </div>
      )}
    </div>
  )
}

export type { TaskSolutionType }
