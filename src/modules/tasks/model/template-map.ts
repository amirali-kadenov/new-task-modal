import type { ComponentType } from 'react'

import type { ValueOf } from '@/types/utils'

import { withTaskLoading } from '../lib/with-task-loading'

import { TemplateTypes } from './template-types'

const wrap = <T extends ComponentType>(
  importFn: () => Promise<{ default: T }>,
) =>
  importFn().then((m) => ({
    default: withTaskLoading(m.default),
  }))

export const TEMPLATE_MAP = {
  [TemplateTypes.Text]: () => wrap(() => import('../ui/templates/text/text')),
  [TemplateTypes.Test]: () => wrap(() => import('../ui/templates/test/test')),
  [TemplateTypes.AnswerCell]: () =>
    wrap(() => import('../ui/templates/answer-cell/answer-cell')),
  [TemplateTypes.ColumnOperation]: () =>
    wrap(() => import('../ui/templates/column-operation/column-operation')),
  [TemplateTypes.MultiInput]: () =>
    wrap(() => import('../ui/templates/multi-input/multi-input')),
  [TemplateTypes.Table]: () =>
    wrap(() => import('../ui/templates/table/table')),
  [TemplateTypes.Comparison]: () =>
    wrap(() => import('../ui/templates/comparison/comparison')),
  [TemplateTypes.Equation]: () =>
    wrap(() => import('../ui/templates/equation/equation')),
} satisfies Record<ValueOf<typeof TemplateTypes>, () => any>

export type TemplateType = Awaited<
  ReturnType<ValueOf<typeof TEMPLATE_MAP>>
>['default']
