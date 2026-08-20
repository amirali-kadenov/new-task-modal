import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import {
  isComplexSolution,
  isFormulaStringSolution,
  type TaskSolutionValue,
} from '@/modules/tasks/lib/solution-types'
import { getDescriptionTranslation } from '@/modules/tasks/ui/common/task-description/model/get-description-translation'
import { ComplexSolutionParts } from '@/modules/tasks/ui/common/task-solution/complex-solution-parts'
import { SolutionContentText } from '@/modules/tasks/ui/common/task-solution/solution-content-text'
import {
  isDivisionCornerTex,
  parseDivisionCorner,
} from '@/modules/tasks/ui/templates/column-operation/lib/parse-division-corner'
import { toDivisionCornerNumbers } from '@/modules/tasks/ui/templates/column-operation/lib/parse-division-corner-numbers'
import { LongDivisionSteps } from '@/modules/tasks/ui/templates/column-operation/shared/long-division-steps'
import { uprightMathUnits } from '@/modules/tasks/ui/templates/text/lib/upright-math-units'
import type { Task } from '@/types/api/task'
import type { TaskDescriptionType } from '@/types/enums'
import { MathText } from '@/ui/math-text/math-text'

import s from './chat-explanation.module.scss'

interface Props {
  task: Task<TaskDescriptionType>
  solution: TaskSolutionValue
  deps: TaskModalDependencies
}

/**
 * AI-chat-only explanation block. Duplicated from `SolutionExplanation` /
 * `SharedSolutionBody` (task-solution) so the "ОБЪЯСНЕНИЕ" label always
 * shows regardless of solution shape — `SharedSolutionBody` routes
 * complex/`parts` solutions straight to `ComplexSolutionParts`, which never
 * renders a title, so reusing it here would silently drop the label.
 */
export const ChatExplanation = ({ task, solution, deps }: Props) => {
  const rawDescription = getDescriptionTranslation(task, deps)
  const isDivision = Boolean(
    rawDescription && isDivisionCornerTex(rawDescription),
  )
  const divisionCornerParts =
    isDivision && rawDescription ? parseDivisionCorner(rawDescription) : null
  const divisionNumbers = divisionCornerParts
    ? toDivisionCornerNumbers(divisionCornerParts)
    : null

  if (divisionNumbers) {
    return (
      <div className={s.container}>
        <p className={s.label}>Объяснение</p>
        <LongDivisionSteps
          dividend={divisionNumbers.dividend}
          divisor={divisionNumbers.divisor}
        />
      </div>
    )
  }

  if (typeof solution === 'object' && solution !== null && solution.error) {
    const errorText =
      typeof solution.error === 'string'
        ? solution.error
        : deps.global.translateTasks(solution.error)

    return (
      <div className={s.container}>
        <MathText inline>{uprightMathUnits(errorText)}</MathText>
      </div>
    )
  }

  if (isFormulaStringSolution(solution)) {
    return (
      <div className={s.container}>
        <p className={s.label}>Объяснение</p>
        <SolutionContentText content={solution} formulaClassName={s.formula} />
      </div>
    )
  }

  if (typeof solution !== 'object' || solution === null) {
    return null
  }

  const hasComplex = isComplexSolution(solution)

  const simpleContent =
    !hasComplex &&
    solution.content &&
    (typeof solution.content === 'string'
      ? solution.content
      : deps.global.translateTasks(solution.content))

  const hasSimple = Boolean(
    typeof simpleContent === 'string' && simpleContent.trim(),
  )

  if (!hasComplex && !hasSimple) {
    return null
  }

  return (
    <div className={s.container}>
      <p className={s.label}>Объяснение</p>

      {hasComplex && (
        <ComplexSolutionParts parts={solution.parts} deps={deps} />
      )}

      {hasSimple && (
        <SolutionContentText
          content={simpleContent as string}
          formulaClassName={s.formula}
        />
      )}
    </div>
  )
}
