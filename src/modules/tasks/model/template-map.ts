import type { ComponentType } from 'react'

import { withTaskLoading } from '@/modules/tasks/lib/with-task-loading'
import { TemplateTypes } from '@/modules/tasks/model/template-types'
import type { TaskComponentProps } from '@/modules/tasks/model/types'
import type { AnswerCellTask } from '@/modules/tasks/ui/templates/answer-cell/lib/types.task'
import type { ColumnOperationTask } from '@/modules/tasks/ui/templates/column-operation/lib/types.task'
import type { ComparisonTask } from '@/modules/tasks/ui/templates/comparison/lib/types.task'
import type { ComplexTask } from '@/modules/tasks/ui/templates/complex/lib/types.task'
import type { EquationTask } from '@/modules/tasks/ui/templates/equation/shared/lib/types.task'
import type { FormulaTask } from '@/modules/tasks/ui/templates/formula/lib/types.task'
import type { TableTask } from '@/modules/tasks/ui/templates/table/lib/types.task'
import type { TestTask } from '@/modules/tasks/ui/templates/test/lib/types.task'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'
import type { ValueOf } from '@/types/utils'

type TextTemplateComponent = ComponentType<TaskComponentProps<TextTask>>
type ColumnOperationTemplateComponent = ComponentType<
  TaskComponentProps<ColumnOperationTask>
>
type TableTemplateComponent = ComponentType<TaskComponentProps<TableTask>>
type FormulaTemplateComponent = ComponentType<TaskComponentProps<FormulaTask>>
type ComplexTemplateComponent = ComponentType<TaskComponentProps<ComplexTask>>
type AnswerCellTemplateComponent = ComponentType<
  TaskComponentProps<AnswerCellTask>
>
type ComparisonTemplateComponent = ComponentType<
  TaskComponentProps<ComparisonTask>
>
type TestTemplateComponent = ComponentType<TaskComponentProps<TestTask>>
type EquationTemplateComponent = ComponentType<TaskComponentProps<EquationTask>>

const wrapText = (
  importFn: () => Promise<{ default: TextTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapColumnOperation = (
  importFn: () => Promise<{ default: ColumnOperationTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapTable = (
  importFn: () => Promise<{ default: TableTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapFormula = (
  importFn: () => Promise<{ default: FormulaTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapComplex = (
  importFn: () => Promise<{ default: ComplexTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapAnswerCell = (
  importFn: () => Promise<{ default: AnswerCellTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapComparison = (
  importFn: () => Promise<{ default: ComparisonTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapTest = (
  importFn: () => Promise<{ default: TestTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

const wrapEquation = (
  importFn: () => Promise<{ default: EquationTemplateComponent }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

/**
 * Live template loaders.
 * Fill as templates appear under `ui/templates/`.
 */
export const TEMPLATE_MAP = {
  [TemplateTypes.Text.Plain]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/plain').then((module) => ({
        default: module.TextPlain,
      })),
    ),
  [TemplateTypes.Text.Before]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/before').then((module) => ({
        default: module.TextBefore,
      })),
    ),
  [TemplateTypes.Text.After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/after').then((module) => ({
        default: module.TextAfter,
      })),
    ),
  [TemplateTypes.Text.BeforeAfter]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/before-after').then(
        (module) => ({ default: module.TextBeforeAfter }),
      ),
    ),
  [TemplateTypes.Text.AiTranslation]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/ai-translation').then(
        (module) => ({ default: module.TextAiTranslation }),
      ),
    ),
  [TemplateTypes.Text.Multi.Stack.N2Before]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n2-before').then(
        (module) => ({ default: module.TextMultiStackN2Before }),
      ),
    ),
  [TemplateTypes.Text.Multi.Stack.N2After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n2-after').then(
        (module) => ({ default: module.TextMultiStackN2After }),
      ),
    ),
  [TemplateTypes.Text.Multi.Stack.N2BeforeAfter]: () =>
    wrapText(() =>
      import(
        '@/modules/tasks/ui/templates/text/ui/multi/stack-n2-before-after'
      ).then((module) => ({ default: module.TextMultiStackN2BeforeAfter })),
    ),
  [TemplateTypes.Text.Multi.Stack.N3Before]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n3-before').then(
        (module) => ({ default: module.TextMultiStackN3Before }),
      ),
    ),
  [TemplateTypes.Text.Multi.Stack.N3BeforeAfter]: () =>
    wrapText(() =>
      import(
        '@/modules/tasks/ui/templates/text/ui/multi/stack-n3-before-after'
      ).then((module) => ({ default: module.TextMultiStackN3BeforeAfter })),
    ),
  [TemplateTypes.Text.Multi.Stack.N4After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n4-after').then(
        (module) => ({ default: module.TextMultiStackN4After }),
      ),
    ),
  [TemplateTypes.Text.Multi.Stack.N5After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/stack-n5-after').then(
        (module) => ({ default: module.TextMultiStackN5After }),
      ),
    ),
  [TemplateTypes.Text.Multi.Inline.N2After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/inline-n2-after').then(
        (module) => ({ default: module.TextMultiInlineN2After }),
      ),
    ),
  [TemplateTypes.Text.Multi.Inline.N3BeforeAfter]: () =>
    wrapText(() =>
      import(
        '@/modules/tasks/ui/templates/text/ui/multi/inline-n3-before-after'
      ).then((module) => ({ default: module.TextMultiInlineN3BeforeAfter })),
    ),
  [TemplateTypes.Text.Multi.Inline.N5After]: () =>
    wrapText(() =>
      import('@/modules/tasks/ui/templates/text/ui/multi/inline-n5-after').then(
        (module) => ({ default: module.TextMultiInlineN5After }),
      ),
    ),
  [TemplateTypes.ColumnOperation.Plain]: () =>
    wrapColumnOperation(() =>
      import('@/modules/tasks/ui/templates/column-operation/ui/plain').then(
        (module) => ({ default: module.ColumnOperationPlain }),
      ),
    ),
  [TemplateTypes.ColumnOperation.Multi.Stack.N2Before]: () =>
    wrapColumnOperation(() =>
      import(
        '@/modules/tasks/ui/templates/column-operation/ui/multi/stack-n2-before'
      ).then((module) => ({
        default: module.ColumnOperationMultiStackN2Before,
      })),
    ),
  [TemplateTypes.Table.Plain]: () =>
    wrapTable(() =>
      import('@/modules/tasks/ui/templates/table/ui/plain').then((module) => ({
        default: module.TablePlain,
      })),
    ),
  [TemplateTypes.Table.Grid]: () =>
    wrapTable(() =>
      import('@/modules/tasks/ui/templates/table/ui/grid').then((module) => ({
        default: module.TableGrid,
      })),
    ),
  [TemplateTypes.Table.Inline]: () =>
    wrapTable(() =>
      import('@/modules/tasks/ui/templates/table/ui/inline').then((module) => ({
        default: module.TableInline,
      })),
    ),
  [TemplateTypes.Table.List]: () =>
    wrapTable(() =>
      import('@/modules/tasks/ui/templates/table/ui/list').then((module) => ({
        default: module.TableList,
      })),
    ),
  [TemplateTypes.Table.Mixed]: () =>
    wrapTable(() =>
      import('@/modules/tasks/ui/templates/table/ui/mixed').then((module) => ({
        default: module.TableMixed,
      })),
    ),
  [TemplateTypes.Table.MultiRow]: () =>
    wrapTable(() =>
      import('@/modules/tasks/ui/templates/table/ui/multi-row').then(
        (module) => ({
          default: module.TableMultiRow,
        }),
      ),
    ),
  [TemplateTypes.Table.MultiRowSvg]: () =>
    wrapTable(() =>
      import('@/modules/tasks/ui/templates/table/ui/multi-row-svg').then(
        (module) => ({ default: module.TableMultiRowSvg }),
      ),
    ),

  [TemplateTypes.Formula.Plain]: () =>
    wrapFormula(() =>
      import('@/modules/tasks/ui/templates/formula/ui/plain').then(
        (module) => ({ default: module.FormulaPlain }),
      ),
    ),
  [TemplateTypes.Formula.After]: () =>
    wrapFormula(() =>
      import('@/modules/tasks/ui/templates/formula/ui/after').then(
        (module) => ({ default: module.FormulaAfter }),
      ),
    ),
  [TemplateTypes.Formula.Multi.Stack.N2Before]: () =>
    wrapFormula(() =>
      import(
        '@/modules/tasks/ui/templates/formula/ui/multi/stack-n2-before'
      ).then((module) => ({ default: module.FormulaMultiStackN2Before })),
    ),
  [TemplateTypes.Complex.Plain]: () =>
    wrapComplex(() =>
      import('@/modules/tasks/ui/templates/complex/ui/plain').then(
        (module) => ({ default: module.ComplexPlain }),
      ),
    ),
  [TemplateTypes.Complex.PlainCenter]: () =>
    wrapComplex(() =>
      import('@/modules/tasks/ui/templates/complex/ui/plain-center').then(
        (module) => ({ default: module.ComplexPlainCenter }),
      ),
    ),
  [TemplateTypes.Complex.After]: () =>
    wrapComplex(() =>
      import('@/modules/tasks/ui/templates/complex/ui/after').then(
        (module) => ({ default: module.ComplexAfter }),
      ),
    ),
  [TemplateTypes.Complex.AfterEquation]: () =>
    wrapComplex(() =>
      import('@/modules/tasks/ui/templates/complex/ui/after-equation').then(
        (module) => ({ default: module.ComplexAfterEquation }),
      ),
    ),
  [TemplateTypes.Complex.BeforeAfter]: () =>
    wrapComplex(() =>
      import('@/modules/tasks/ui/templates/complex/ui/before-after').then(
        (module) => ({ default: module.ComplexBeforeAfter }),
      ),
    ),
  [TemplateTypes.Complex.Multi.Stack.N2After]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n2-after'
      ).then((module) => ({ default: module.ComplexMultiStackN2After })),
    ),
  [TemplateTypes.Complex.Multi.Stack.N2BeforeAfter]: () =>
    wrapComplex(() =>
      import(
        '@/modules/tasks/ui/templates/complex/ui/multi/stack-n2-before-after'
      ).then((module) => ({
        default: module.ComplexMultiStackN2BeforeAfter,
      })),
    ),
  [TemplateTypes.AnswerCell.Plain]: () =>
    wrapAnswerCell(() =>
      import('@/modules/tasks/ui/templates/answer-cell/ui/plain').then(
        (module) => ({ default: module.AnswerCellPlain }),
      ),
    ),
  [TemplateTypes.AnswerCell.PlainCenter]: () =>
    wrapAnswerCell(() =>
      import('@/modules/tasks/ui/templates/answer-cell/ui/plain-center').then(
        (module) => ({ default: module.AnswerCellPlainCenter }),
      ),
    ),
  [TemplateTypes.AnswerCell.After]: () =>
    wrapAnswerCell(() =>
      import('@/modules/tasks/ui/templates/answer-cell/ui/after').then(
        (module) => ({ default: module.AnswerCellAfter }),
      ),
    ),
  [TemplateTypes.AnswerCell.Multi.Inline.N2Plain]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/inline-n2-plain'
      ).then((module) => ({ default: module.AnswerCellMultiInlineN2Plain })),
    ),
  [TemplateTypes.AnswerCell.Multi.Stack.N2Plain]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/stack-n2-plain'
      ).then((module) => ({ default: module.AnswerCellMultiStackN2Plain })),
    ),
  [TemplateTypes.AnswerCell.Multi.Stack.N2Sequence]: () =>
    wrapAnswerCell(() =>
      import(
        '@/modules/tasks/ui/templates/answer-cell/ui/multi/stack-n2-sequence'
      ).then((module) => ({
        default: module.AnswerCellMultiStackN2Sequence,
      })),
    ),
  [TemplateTypes.Comparison.Plain]: () =>
    wrapComparison(() =>
      import('@/modules/tasks/ui/templates/comparison/ui/plain').then(
        (module) => ({ default: module.ComparisonPlain }),
      ),
    ),
  [TemplateTypes.Test.Plain]: () =>
    wrapTest(() =>
      import('@/modules/tasks/ui/templates/test/ui/plain').then((module) => ({
        default: module.TestPlain,
      })),
    ),
  [TemplateTypes.Equation.Before]: () =>
    wrapEquation(() =>
      import('@/modules/tasks/ui/templates/equation/ui/before').then(
        (module) => ({ default: module.EquationBefore }),
      ),
    ),
} satisfies Record<string, unknown>

export type TemplateType = Awaited<
  ReturnType<ValueOf<typeof TEMPLATE_MAP>>
>['default']
