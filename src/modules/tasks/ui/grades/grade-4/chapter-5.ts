import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.ColumnOperation.Multi.Stack.N2Before]: [14],
  [TemplateTypes.ColumnOperation.Plain]: [3, 4],
  [TemplateTypes.Complex.Plain]: [5, 6, 7, 8, 9, 10, 11, 12],
  [TemplateTypes.Formula.Multi.Stack.N2Before]: [13],
  [TemplateTypes.Text.After]: [19, 20, 24, 25, 27, 31, 32, 33, 34],
  [TemplateTypes.Text.Plain]: [15, 16, 17, 18, 21, 22, 23, 26, 28, 29, 30],
  [TemplateTypes.Table.Plain]: [1, 2],
}

export default map
