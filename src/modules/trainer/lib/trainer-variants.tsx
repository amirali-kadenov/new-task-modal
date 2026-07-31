import type { ComponentType, ReactNode } from 'react'

import type { TaskComponentProps } from '@/modules/tasks/model/types'
import {
  getGroupControlOptions,
  pickTask,
  TextTemplateTrainer,
} from '@/modules/tasks/ui/templates/text/lib/storybook'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'

import type { TrainerStateTab } from './apply-trainer-state'

import { AnswerCellAfter } from '@/modules/tasks/ui/templates/answer-cell/ui/after'
import groups_AnswerCell_after from '@/modules/tasks/ui/templates/answer-cell/ui/after/data/groups.json'
import task_AnswerCell_after from '@/modules/tasks/ui/templates/answer-cell/ui/after/data/task.json'
import { AnswerCellMultiInlineN2Plain } from '@/modules/tasks/ui/templates/answer-cell/ui/multi/inline-n2-plain'
import groups_AnswerCell_multi_inline_n2_plain from '@/modules/tasks/ui/templates/answer-cell/ui/multi/inline-n2-plain/data/groups.json'
import task_AnswerCell_multi_inline_n2_plain from '@/modules/tasks/ui/templates/answer-cell/ui/multi/inline-n2-plain/data/task.json'
import { AnswerCellMultiStackN2Plain } from '@/modules/tasks/ui/templates/answer-cell/ui/multi/stack-n2-plain'
import groups_AnswerCell_multi_stack_n2_plain from '@/modules/tasks/ui/templates/answer-cell/ui/multi/stack-n2-plain/data/groups.json'
import task_AnswerCell_multi_stack_n2_plain from '@/modules/tasks/ui/templates/answer-cell/ui/multi/stack-n2-plain/data/task.json'
import { AnswerCellPlain } from '@/modules/tasks/ui/templates/answer-cell/ui/plain'
import groups_AnswerCell_plain from '@/modules/tasks/ui/templates/answer-cell/ui/plain/data/groups.json'
import task_AnswerCell_plain from '@/modules/tasks/ui/templates/answer-cell/ui/plain/data/task.json'
import { ColumnOperationMultiStackN2Before } from '@/modules/tasks/ui/templates/column-operation/ui/multi/stack-n2-before'
import groups_ColumnOperation_multi_stack_n2_before from '@/modules/tasks/ui/templates/column-operation/ui/multi/stack-n2-before/data/groups.json'
import task_ColumnOperation_multi_stack_n2_before from '@/modules/tasks/ui/templates/column-operation/ui/multi/stack-n2-before/data/task.json'
import { ColumnOperationPlain } from '@/modules/tasks/ui/templates/column-operation/ui/plain'
import groups_ColumnOperation_plain from '@/modules/tasks/ui/templates/column-operation/ui/plain/data/groups.json'
import task_ColumnOperation_plain from '@/modules/tasks/ui/templates/column-operation/ui/plain/data/task.json'
import { ComparisonPlain } from '@/modules/tasks/ui/templates/comparison/ui/plain'
import groups_Comparison_plain from '@/modules/tasks/ui/templates/comparison/ui/plain/data/groups.json'
import task_Comparison_plain from '@/modules/tasks/ui/templates/comparison/ui/plain/data/task.json'
import { ComplexAfter } from '@/modules/tasks/ui/templates/complex/ui/after'
import groups_Complex_after from '@/modules/tasks/ui/templates/complex/ui/after/data/groups.json'
import task_Complex_after from '@/modules/tasks/ui/templates/complex/ui/after/data/task.json'
import { ComplexBeforeAfter } from '@/modules/tasks/ui/templates/complex/ui/before-after'
import groups_Complex_beforeAfter from '@/modules/tasks/ui/templates/complex/ui/before-after/data/groups.json'
import task_Complex_beforeAfter from '@/modules/tasks/ui/templates/complex/ui/before-after/data/task.json'
import { ComplexMultiStackN2After } from '@/modules/tasks/ui/templates/complex/ui/multi/stack-n2-after'
import groups_Complex_multi_stack_n2_after from '@/modules/tasks/ui/templates/complex/ui/multi/stack-n2-after/data/groups.json'
import task_Complex_multi_stack_n2_after from '@/modules/tasks/ui/templates/complex/ui/multi/stack-n2-after/data/task.json'
import { ComplexMultiStackN2BeforeAfter } from '@/modules/tasks/ui/templates/complex/ui/multi/stack-n2-before-after'
import groups_Complex_multi_stack_n2_beforeAfter from '@/modules/tasks/ui/templates/complex/ui/multi/stack-n2-before-after/data/groups.json'
import task_Complex_multi_stack_n2_beforeAfter from '@/modules/tasks/ui/templates/complex/ui/multi/stack-n2-before-after/data/task.json'
import { ComplexPlain } from '@/modules/tasks/ui/templates/complex/ui/plain'
import groups_Complex_plain from '@/modules/tasks/ui/templates/complex/ui/plain/data/groups.json'
import task_Complex_plain from '@/modules/tasks/ui/templates/complex/ui/plain/data/task.json'
import { EquationBefore } from '@/modules/tasks/ui/templates/equation/ui/before'
import groups_Equation_before from '@/modules/tasks/ui/templates/equation/ui/before/data/groups.json'
import task_Equation_before from '@/modules/tasks/ui/templates/equation/ui/before/data/task.json'
import { FormulaAfter } from '@/modules/tasks/ui/templates/formula/ui/after'
import groups_Formula_after from '@/modules/tasks/ui/templates/formula/ui/after/data/groups.json'
import task_Formula_after from '@/modules/tasks/ui/templates/formula/ui/after/data/task.json'
import { FormulaMultiStackN2Before } from '@/modules/tasks/ui/templates/formula/ui/multi/stack-n2-before'
import groups_Formula_multi_stack_n2_before from '@/modules/tasks/ui/templates/formula/ui/multi/stack-n2-before/data/groups.json'
import task_Formula_multi_stack_n2_before from '@/modules/tasks/ui/templates/formula/ui/multi/stack-n2-before/data/task.json'
import { FormulaPlain } from '@/modules/tasks/ui/templates/formula/ui/plain'
import groups_Formula_plain from '@/modules/tasks/ui/templates/formula/ui/plain/data/groups.json'
import task_Formula_plain from '@/modules/tasks/ui/templates/formula/ui/plain/data/task.json'
import { TableGrid } from '@/modules/tasks/ui/templates/table/ui/grid'
import groups_Table_grid from '@/modules/tasks/ui/templates/table/ui/grid/data/groups.json'
import task_Table_grid from '@/modules/tasks/ui/templates/table/ui/grid/data/task.json'
import { TableInline } from '@/modules/tasks/ui/templates/table/ui/inline'
import groups_Table_inline from '@/modules/tasks/ui/templates/table/ui/inline/data/groups.json'
import task_Table_inline from '@/modules/tasks/ui/templates/table/ui/inline/data/task.json'
import { TableList } from '@/modules/tasks/ui/templates/table/ui/list'
import groups_Table_list from '@/modules/tasks/ui/templates/table/ui/list/data/groups.json'
import task_Table_list from '@/modules/tasks/ui/templates/table/ui/list/data/task.json'
import { TableMixed } from '@/modules/tasks/ui/templates/table/ui/mixed'
import groups_Table_mixed from '@/modules/tasks/ui/templates/table/ui/mixed/data/groups.json'
import task_Table_mixed from '@/modules/tasks/ui/templates/table/ui/mixed/data/task.json'
import { TableMultiRow } from '@/modules/tasks/ui/templates/table/ui/multi-row'
import groups_Table_multi_row from '@/modules/tasks/ui/templates/table/ui/multi-row/data/groups.json'
import task_Table_multi_row from '@/modules/tasks/ui/templates/table/ui/multi-row/data/task.json'
import { TableMultiRowSvg } from '@/modules/tasks/ui/templates/table/ui/multi-row-svg'
import groups_Table_multi_row_svg from '@/modules/tasks/ui/templates/table/ui/multi-row-svg/data/groups.json'
import task_Table_multi_row_svg from '@/modules/tasks/ui/templates/table/ui/multi-row-svg/data/task.json'
import { TablePlain } from '@/modules/tasks/ui/templates/table/ui/plain'
import groups_Table_plain from '@/modules/tasks/ui/templates/table/ui/plain/data/groups.json'
import task_Table_plain from '@/modules/tasks/ui/templates/table/ui/plain/data/task.json'
import { TestPlain } from '@/modules/tasks/ui/templates/test/ui/plain'
import groups_Test_plain from '@/modules/tasks/ui/templates/test/ui/plain/data/groups.json'
import task_Test_plain from '@/modules/tasks/ui/templates/test/ui/plain/data/task.json'
import { TextAfter } from '@/modules/tasks/ui/templates/text/ui/after'
import groups_Text_after from '@/modules/tasks/ui/templates/text/ui/after/data/groups.json'
import task_Text_after from '@/modules/tasks/ui/templates/text/ui/after/data/task.json'
import { TextAiTranslation } from '@/modules/tasks/ui/templates/text/ui/ai-translation'
import groups_Text_ai_translation from '@/modules/tasks/ui/templates/text/ui/ai-translation/data/groups.json'
import task_Text_ai_translation from '@/modules/tasks/ui/templates/text/ui/ai-translation/data/task.json'
import { TextBefore } from '@/modules/tasks/ui/templates/text/ui/before'
import groups_Text_before from '@/modules/tasks/ui/templates/text/ui/before/data/groups.json'
import task_Text_before from '@/modules/tasks/ui/templates/text/ui/before/data/task.json'
import { TextBeforeAfter } from '@/modules/tasks/ui/templates/text/ui/before-after'
import groups_Text_before_after from '@/modules/tasks/ui/templates/text/ui/before-after/data/groups.json'
import task_Text_before_after from '@/modules/tasks/ui/templates/text/ui/before-after/data/task.json'
import { TextMultiInlineN2After } from '@/modules/tasks/ui/templates/text/ui/multi/inline-n2-after'
import groups_Text_multi_inline_n2_after from '@/modules/tasks/ui/templates/text/ui/multi/inline-n2-after/data/groups.json'
import task_Text_multi_inline_n2_after from '@/modules/tasks/ui/templates/text/ui/multi/inline-n2-after/data/task.json'
import { TextMultiInlineN3BeforeAfter } from '@/modules/tasks/ui/templates/text/ui/multi/inline-n3-before-after'
import groups_Text_multi_inline_n3_before_after from '@/modules/tasks/ui/templates/text/ui/multi/inline-n3-before-after/data/groups.json'
import task_Text_multi_inline_n3_before_after from '@/modules/tasks/ui/templates/text/ui/multi/inline-n3-before-after/data/task.json'
import { TextMultiInlineN5After } from '@/modules/tasks/ui/templates/text/ui/multi/inline-n5-after'
import groups_Text_multi_inline_n5_after from '@/modules/tasks/ui/templates/text/ui/multi/inline-n5-after/data/groups.json'
import task_Text_multi_inline_n5_after from '@/modules/tasks/ui/templates/text/ui/multi/inline-n5-after/data/task.json'
import { TextMultiStackN2After } from '@/modules/tasks/ui/templates/text/ui/multi/stack-n2-after'
import groups_Text_multi_stack_n2_after from '@/modules/tasks/ui/templates/text/ui/multi/stack-n2-after/data/groups.json'
import task_Text_multi_stack_n2_after from '@/modules/tasks/ui/templates/text/ui/multi/stack-n2-after/data/task.json'
import { TextMultiStackN2Before } from '@/modules/tasks/ui/templates/text/ui/multi/stack-n2-before'
import groups_Text_multi_stack_n2_before from '@/modules/tasks/ui/templates/text/ui/multi/stack-n2-before/data/groups.json'
import task_Text_multi_stack_n2_before from '@/modules/tasks/ui/templates/text/ui/multi/stack-n2-before/data/task.json'
import { TextMultiStackN2BeforeAfter } from '@/modules/tasks/ui/templates/text/ui/multi/stack-n2-before-after'
import groups_Text_multi_stack_n2_before_after from '@/modules/tasks/ui/templates/text/ui/multi/stack-n2-before-after/data/groups.json'
import task_Text_multi_stack_n2_before_after from '@/modules/tasks/ui/templates/text/ui/multi/stack-n2-before-after/data/task.json'
import { TextMultiStackN3Before } from '@/modules/tasks/ui/templates/text/ui/multi/stack-n3-before'
import groups_Text_multi_stack_n3_before from '@/modules/tasks/ui/templates/text/ui/multi/stack-n3-before/data/groups.json'
import task_Text_multi_stack_n3_before from '@/modules/tasks/ui/templates/text/ui/multi/stack-n3-before/data/task.json'
import { TextMultiStackN3BeforeAfter } from '@/modules/tasks/ui/templates/text/ui/multi/stack-n3-before-after'
import groups_Text_multi_stack_n3_before_after from '@/modules/tasks/ui/templates/text/ui/multi/stack-n3-before-after/data/groups.json'
import task_Text_multi_stack_n3_before_after from '@/modules/tasks/ui/templates/text/ui/multi/stack-n3-before-after/data/task.json'
import { TextMultiStackN4After } from '@/modules/tasks/ui/templates/text/ui/multi/stack-n4-after'
import groups_Text_multi_stack_n4_after from '@/modules/tasks/ui/templates/text/ui/multi/stack-n4-after/data/groups.json'
import task_Text_multi_stack_n4_after from '@/modules/tasks/ui/templates/text/ui/multi/stack-n4-after/data/task.json'
import { TextMultiStackN5After } from '@/modules/tasks/ui/templates/text/ui/multi/stack-n5-after'
import groups_Text_multi_stack_n5_after from '@/modules/tasks/ui/templates/text/ui/multi/stack-n5-after/data/groups.json'
import task_Text_multi_stack_n5_after from '@/modules/tasks/ui/templates/text/ui/multi/stack-n5-after/data/task.json'
import { TextPlain } from '@/modules/tasks/ui/templates/text/ui/plain'
import groups_Text_plain from '@/modules/tasks/ui/templates/text/ui/plain/data/groups.json'
import task_Text_plain from '@/modules/tasks/ui/templates/text/ui/plain/data/task.json'

export type TrainerVariant = {
  key: string
  label: string
  groupIds: string[]
  defaultGroup: string
  /** Fixture groups — used by Storybook play helpers. */
  groups: Array<{ group: string; task?: TextTask }>
  /** Fallback task fixture when the selected group has no task. */
  fallbackTask: unknown
  render: (group: string, stateTab?: TrainerStateTab) => ReactNode
}

const makeVariant = ({
  key,
  label,
  Template,
  groupsJson,
  fallbackTask,
}: {
  key: string
  label: string
  Template: ComponentType<TaskComponentProps<any>>
  groupsJson: unknown
  fallbackTask: unknown
}): TrainerVariant => {
  const groups = groupsJson as Array<{ group: string; task?: TextTask }>
  const { groupIds, defaultGroup } = getGroupControlOptions(groups as any)
  return {
    key,
    label,
    groupIds,
    defaultGroup,
    groups,
    fallbackTask,
    render: (group, stateTab = 'idle') => {
      const TrainerTemplate =
        Template as ComponentType<TaskComponentProps<TextTask>>
      return (
        <TextTemplateTrainer
          Template={TrainerTemplate}
          task={pickTask(groups as any, group, fallbackTask as TextTask)}
          stateTab={stateTab}
        />
      )
    },
  }
}

export const TRAINER_VARIANTS: TrainerVariant[] = [
  makeVariant({
    key: 'AnswerCell/after',
    label: 'AnswerCell / after',
    Template: AnswerCellAfter,
    groupsJson: groups_AnswerCell_after,
    fallbackTask: task_AnswerCell_after,
  }),
  makeVariant({
    key: 'AnswerCell/multi/inline-n2-plain',
    label: 'AnswerCell / multi / inline-n2-plain',
    Template: AnswerCellMultiInlineN2Plain,
    groupsJson: groups_AnswerCell_multi_inline_n2_plain,
    fallbackTask: task_AnswerCell_multi_inline_n2_plain,
  }),
  makeVariant({
    key: 'AnswerCell/multi/stack-n2-plain',
    label: 'AnswerCell / multi / stack-n2-plain',
    Template: AnswerCellMultiStackN2Plain,
    groupsJson: groups_AnswerCell_multi_stack_n2_plain,
    fallbackTask: task_AnswerCell_multi_stack_n2_plain,
  }),
  makeVariant({
    key: 'AnswerCell/plain',
    label: 'AnswerCell / plain',
    Template: AnswerCellPlain,
    groupsJson: groups_AnswerCell_plain,
    fallbackTask: task_AnswerCell_plain,
  }),
  makeVariant({
    key: 'ColumnOperation/multi/stack-n2-before',
    label: 'ColumnOperation / multi / stack-n2-before',
    Template: ColumnOperationMultiStackN2Before,
    groupsJson: groups_ColumnOperation_multi_stack_n2_before,
    fallbackTask: task_ColumnOperation_multi_stack_n2_before,
  }),
  makeVariant({
    key: 'ColumnOperation/plain',
    label: 'ColumnOperation / plain',
    Template: ColumnOperationPlain,
    groupsJson: groups_ColumnOperation_plain,
    fallbackTask: task_ColumnOperation_plain,
  }),
  makeVariant({
    key: 'Comparison/plain',
    label: 'Comparison / plain',
    Template: ComparisonPlain,
    groupsJson: groups_Comparison_plain,
    fallbackTask: task_Comparison_plain,
  }),
  makeVariant({
    key: 'Complex/after',
    label: 'Complex / after',
    Template: ComplexAfter,
    groupsJson: groups_Complex_after,
    fallbackTask: task_Complex_after,
  }),
  makeVariant({
    key: 'Complex/beforeAfter',
    label: 'Complex / beforeAfter',
    Template: ComplexBeforeAfter,
    groupsJson: groups_Complex_beforeAfter,
    fallbackTask: task_Complex_beforeAfter,
  }),
  makeVariant({
    key: 'Complex/multi/stack-n2-after',
    label: 'Complex / multi / stack-n2-after',
    Template: ComplexMultiStackN2After,
    groupsJson: groups_Complex_multi_stack_n2_after,
    fallbackTask: task_Complex_multi_stack_n2_after,
  }),
  makeVariant({
    key: 'Complex/multi/stack-n2-beforeAfter',
    label: 'Complex / multi / stack-n2-beforeAfter',
    Template: ComplexMultiStackN2BeforeAfter,
    groupsJson: groups_Complex_multi_stack_n2_beforeAfter,
    fallbackTask: task_Complex_multi_stack_n2_beforeAfter,
  }),
  makeVariant({
    key: 'Complex/plain',
    label: 'Complex / plain',
    Template: ComplexPlain,
    groupsJson: groups_Complex_plain,
    fallbackTask: task_Complex_plain,
  }),
  makeVariant({
    key: 'Equation/before',
    label: 'Equation / before',
    Template: EquationBefore,
    groupsJson: groups_Equation_before,
    fallbackTask: task_Equation_before,
  }),
  makeVariant({
    key: 'Formula/after',
    label: 'Formula / after',
    Template: FormulaAfter,
    groupsJson: groups_Formula_after,
    fallbackTask: task_Formula_after,
  }),
  makeVariant({
    key: 'Formula/multi/stack-n2-before',
    label: 'Formula / multi / stack-n2-before',
    Template: FormulaMultiStackN2Before,
    groupsJson: groups_Formula_multi_stack_n2_before,
    fallbackTask: task_Formula_multi_stack_n2_before,
  }),
  makeVariant({
    key: 'Formula/plain',
    label: 'Formula / plain',
    Template: FormulaPlain,
    groupsJson: groups_Formula_plain,
    fallbackTask: task_Formula_plain,
  }),
  makeVariant({
    key: 'Table/grid',
    label: 'Table / grid',
    Template: TableGrid,
    groupsJson: groups_Table_grid,
    fallbackTask: task_Table_grid,
  }),
  makeVariant({
    key: 'Table/inline',
    label: 'Table / inline',
    Template: TableInline,
    groupsJson: groups_Table_inline,
    fallbackTask: task_Table_inline,
  }),
  makeVariant({
    key: 'Table/list',
    label: 'Table / list',
    Template: TableList,
    groupsJson: groups_Table_list,
    fallbackTask: task_Table_list,
  }),
  makeVariant({
    key: 'Table/mixed',
    label: 'Table / mixed',
    Template: TableMixed,
    groupsJson: groups_Table_mixed,
    fallbackTask: task_Table_mixed,
  }),
  makeVariant({
    key: 'Table/multi-row',
    label: 'Table / multi-row',
    Template: TableMultiRow,
    groupsJson: groups_Table_multi_row,
    fallbackTask: task_Table_multi_row,
  }),
  makeVariant({
    key: 'Table/multi-row-svg',
    label: 'Table / multi-row-svg',
    Template: TableMultiRowSvg,
    groupsJson: groups_Table_multi_row_svg,
    fallbackTask: task_Table_multi_row_svg,
  }),
  makeVariant({
    key: 'Table/plain',
    label: 'Table / plain',
    Template: TablePlain,
    groupsJson: groups_Table_plain,
    fallbackTask: task_Table_plain,
  }),
  makeVariant({
    key: 'Test/plain',
    label: 'Test / plain',
    Template: TestPlain,
    groupsJson: groups_Test_plain,
    fallbackTask: task_Test_plain,
  }),
  makeVariant({
    key: 'Text/after',
    label: 'Text / after',
    Template: TextAfter,
    groupsJson: groups_Text_after,
    fallbackTask: task_Text_after,
  }),
  makeVariant({
    key: 'Text/ai-translation',
    label: 'Text / ai-translation',
    Template: TextAiTranslation,
    groupsJson: groups_Text_ai_translation,
    fallbackTask: task_Text_ai_translation,
  }),
  makeVariant({
    key: 'Text/before',
    label: 'Text / before',
    Template: TextBefore,
    groupsJson: groups_Text_before,
    fallbackTask: task_Text_before,
  }),
  makeVariant({
    key: 'Text/before-after',
    label: 'Text / before-after',
    Template: TextBeforeAfter,
    groupsJson: groups_Text_before_after,
    fallbackTask: task_Text_before_after,
  }),
  makeVariant({
    key: 'Text/multi/inline-n2-after',
    label: 'Text / multi / inline-n2-after',
    Template: TextMultiInlineN2After,
    groupsJson: groups_Text_multi_inline_n2_after,
    fallbackTask: task_Text_multi_inline_n2_after,
  }),
  makeVariant({
    key: 'Text/multi/inline-n3-before-after',
    label: 'Text / multi / inline-n3-before-after',
    Template: TextMultiInlineN3BeforeAfter,
    groupsJson: groups_Text_multi_inline_n3_before_after,
    fallbackTask: task_Text_multi_inline_n3_before_after,
  }),
  makeVariant({
    key: 'Text/multi/inline-n5-after',
    label: 'Text / multi / inline-n5-after',
    Template: TextMultiInlineN5After,
    groupsJson: groups_Text_multi_inline_n5_after,
    fallbackTask: task_Text_multi_inline_n5_after,
  }),
  makeVariant({
    key: 'Text/multi/stack-n2-after',
    label: 'Text / multi / stack-n2-after',
    Template: TextMultiStackN2After,
    groupsJson: groups_Text_multi_stack_n2_after,
    fallbackTask: task_Text_multi_stack_n2_after,
  }),
  makeVariant({
    key: 'Text/multi/stack-n2-before',
    label: 'Text / multi / stack-n2-before',
    Template: TextMultiStackN2Before,
    groupsJson: groups_Text_multi_stack_n2_before,
    fallbackTask: task_Text_multi_stack_n2_before,
  }),
  makeVariant({
    key: 'Text/multi/stack-n2-before-after',
    label: 'Text / multi / stack-n2-before-after',
    Template: TextMultiStackN2BeforeAfter,
    groupsJson: groups_Text_multi_stack_n2_before_after,
    fallbackTask: task_Text_multi_stack_n2_before_after,
  }),
  makeVariant({
    key: 'Text/multi/stack-n3-before',
    label: 'Text / multi / stack-n3-before',
    Template: TextMultiStackN3Before,
    groupsJson: groups_Text_multi_stack_n3_before,
    fallbackTask: task_Text_multi_stack_n3_before,
  }),
  makeVariant({
    key: 'Text/multi/stack-n3-before-after',
    label: 'Text / multi / stack-n3-before-after',
    Template: TextMultiStackN3BeforeAfter,
    groupsJson: groups_Text_multi_stack_n3_before_after,
    fallbackTask: task_Text_multi_stack_n3_before_after,
  }),
  makeVariant({
    key: 'Text/multi/stack-n4-after',
    label: 'Text / multi / stack-n4-after',
    Template: TextMultiStackN4After,
    groupsJson: groups_Text_multi_stack_n4_after,
    fallbackTask: task_Text_multi_stack_n4_after,
  }),
  makeVariant({
    key: 'Text/multi/stack-n5-after',
    label: 'Text / multi / stack-n5-after',
    Template: TextMultiStackN5After,
    groupsJson: groups_Text_multi_stack_n5_after,
    fallbackTask: task_Text_multi_stack_n5_after,
  }),
  makeVariant({
    key: 'Text/plain',
    label: 'Text / plain',
    Template: TextPlain,
    groupsJson: groups_Text_plain,
    fallbackTask: task_Text_plain,
  }),
]

export const getTrainerVariant = (key: string) =>
  TRAINER_VARIANTS.find((v) => v.key === key) ?? TRAINER_VARIANTS[0]
