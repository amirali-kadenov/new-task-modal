import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { getCorrectMultiAnswerParts } from '@/modules/tasks/lib/get-correct-multi-answer-parts'
import {
  joinMultiAnswer,
  splitMultiAnswer,
} from '@/modules/tasks/lib/multi-answer'
import { getDescriptionTranslation } from '@/modules/tasks/ui/common/task-description/model/get-description-translation'
import { TaskTitle } from '@/modules/tasks/ui/common/task-title/task-title'
import { classifyAnswerCellTemplate } from '@/modules/tasks/ui/templates/answer-cell/lib/classify-answer-cell-template'
import { getAnswerCellUnit } from '@/modules/tasks/ui/templates/answer-cell/lib/get-answer-cell-unit'
import type { SimpleAnswerCellAnswerInput } from '@/modules/tasks/ui/templates/answer-cell/lib/types.task'
import { AnswerCellDescriptionExtras } from '@/modules/tasks/ui/templates/answer-cell/shared/answer-cell-description-extras'
import { AnswerCellRow } from '@/modules/tasks/ui/templates/answer-cell/shared/answer-cell-row'
import type { ColumnOperationTask } from '@/modules/tasks/ui/templates/column-operation/lib/types.task'
import { ColumnOperationDescription } from '@/modules/tasks/ui/templates/column-operation/shared/column-operation-description'
import { classifyComplexTemplate } from '@/modules/tasks/ui/templates/complex/lib/classify-complex-template'
import type { ComplexTaskDescription } from '@/modules/tasks/ui/templates/complex/lib/types.task'
import { ComplexSolutionCondition } from '@/modules/tasks/ui/templates/complex/shared/complex-solution-condition'
import type { FormulaTask } from '@/modules/tasks/ui/templates/formula/lib/types.task'
import { FormulaDescription } from '@/modules/tasks/ui/templates/formula/shared/formula-description'
import { getTestCorrectValue } from '@/modules/tasks/ui/templates/test/lib/get-test-correct-value'
import {
  getTestOptionDisplayValue,
  getTestVariants,
} from '@/modules/tasks/ui/templates/test/lib/get-test-variants'
import type { TestTaskDescription } from '@/modules/tasks/ui/templates/test/lib/types.task'
import { joinMathAnswers } from '@/modules/tasks/ui/templates/text/lib/join-math-answers'
import { uprightMathUnits } from '@/modules/tasks/ui/templates/text/lib/upright-math-units'
import type { Task, TaskDescriptionAnswerCell } from '@/types/api/task'
import type { TaskDescriptionType } from '@/types/enums'
import { MathText } from '@/ui/math-text/math-text'

import { ChatAnswerPanel } from './chat-answer-panel'
import { ChatExplanation } from './chat-explanation'
import s from './chat-solution-view.module.scss'

interface Props {
  task: Task<TaskDescriptionType>
  deps: TaskModalDependencies
  answer: string
}

/**
 * AI-chat-only solution layout: condition + flat answer + explanation.
 * Unlike the task-modal, chat never uses the per-type solution templates
 * (TextSolution, EquationSolution, ...) — it reads `task.description` /
 * `task.solution` generically so one component covers every task type
 * without touching the shared per-template files.
 *
 * `test` is the one exception: its correct answer is stored as a letter
 * (A/B/C…) referencing `description.variants`, not literal answer text, so
 * it needs the same letter→variant resolution the trainer's TestSolution
 * uses — otherwise this view shows the bare letter instead of the option
 * text (or nothing, for tasks relying on the `description.correctAnswer`
 * fallback).
 */
export const ChatSolutionView = ({ task, deps, answer }: Props) => {
  const translate = (value: Parameters<typeof deps.global.translateTasks>[0]) =>
    deps.global.translateTasks(value)
  const separator = deps.helpers.TaskHelper.multipleTaskAnswerSeparator

  const isAnswerCell =
    task.description?.type === deps.enums.TaskDescriptionType.AnswerCell
  const isComplex =
    task.description?.type === deps.enums.TaskDescriptionType.Complex
  const isColumnOperation =
    task.description?.type === deps.enums.TaskDescriptionType.ColumnOperation
  const isTest = task.description?.type === deps.enums.TaskDescriptionType.Test
  const isFormula =
    task.description?.type === deps.enums.TaskDescriptionType.Formula
  const complexDescription = isComplex
    ? (task.description as unknown as ComplexTaskDescription)
    : null
  const testDescription = isTest
    ? (task.description as unknown as TestTaskDescription)
    : null

  const correctParts = getCorrectMultiAnswerParts(
    task.solution,
    separator,
    translate,
  )

  const testOptions = testDescription
    ? getTestVariants(testDescription.variants, translate)
    : []
  const correctAnswer = testDescription
    ? joinMathAnswers([
        getTestOptionDisplayValue(
          testOptions,
          getTestCorrectValue(testDescription, task.solution, translate),
        ),
      ])
    : joinMathAnswers(correctParts)
  const userAnswer = testDescription
    ? getTestOptionDisplayValue(testOptions, answer)
    : splitMultiAnswer(answer, separator).join(' ; ')

  const titleText = deps.global.translateTasks(task.title ?? '')
  const hasTitle = Boolean(titleText?.trim())

  const description = getDescriptionTranslation(task, deps)
  const hasCondition =
    hasTitle ||
    (isComplex
      ? Boolean(complexDescription?.parts?.length)
      : isAnswerCell
        ? correctParts.some((part) => part.trim() !== '')
        : Boolean(description && String(description).trim()))

  const complexEquationLayout =
    isComplex &&
    classifyComplexTemplate(
      task as unknown as Parameters<typeof classifyComplexTemplate>[0],
    ) === 'complex.after.equation'

  const isMultiAnswerCell =
    isAnswerCell &&
    classifyAnswerCellTemplate(task).startsWith('answerCell.multi.')

  const answerCellUnit =
    isAnswerCell && !isMultiAnswerCell
      ? getAnswerCellUnit(
          task.answerInput as SimpleAnswerCellAnswerInput | undefined,
          translate,
        )
      : ''

  // Same equation rendered in the condition block, repeated after the
  // answer/before the explanation, matching the trainer's layout.
  const answerCellEquation = isAnswerCell ? (
    <AnswerCellRow
      description={task.description as TaskDescriptionAnswerCell}
      answerInput={task.answerInput}
      deps={deps}
      answer={joinMultiAnswer(correctParts, separator)}
      mode="solution"
      withBefore
      withAfter
      multi={isMultiAnswerCell}
      taskType={task.type}
    />
  ) : null

  return (
    <div className={s.container}>
      {hasCondition && (
        <div>
          <p className={s.label}>Условие</p>
          <TaskTitle title={task.title} deps={deps} />
          {isComplex && complexDescription ? (
            <ComplexSolutionCondition
              description={complexDescription}
              deps={deps}
              solution={task.solution}
              separator={separator}
              translate={translate}
              equationLayout={complexEquationLayout}
            />
          ) : isAnswerCell ? (
            <AnswerCellDescriptionExtras
              description={task.description as TaskDescriptionAnswerCell}
              deps={deps}
            />
          ) : isColumnOperation ? (
            <ColumnOperationDescription
              task={task as unknown as ColumnOperationTask}
              deps={deps}
              quotient={correctParts[0] || undefined}
              remainder={correctParts[1] || undefined}
            />
          ) : isFormula ? (
            <FormulaDescription
              task={task as unknown as FormulaTask}
              deps={deps}
              className={s.description}
            />
          ) : (
            <MathText className={s.description}>
              {uprightMathUnits(description)}
            </MathText>
          )}
        </div>
      )}

      <ChatAnswerPanel
        userAnswer={userAnswer}
        correctAnswer={correctAnswer}
        unit={answerCellUnit}
        deps={deps}
      />

      {answerCellEquation}

      <ChatExplanation task={task} solution={task.solution} deps={deps} />
    </div>
  )
}
