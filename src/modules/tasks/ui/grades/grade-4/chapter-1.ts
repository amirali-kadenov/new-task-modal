import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.ColumnOperation.Plain]: [28, 29],
  [TemplateTypes.Comparison.Plain]: [13],
  [TemplateTypes.Formula.Plain]: [
    14, 15, 16, 17, 18, 19, 20, 21, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 22,
    23, 24, 25, 26, 27,
  ],
  [TemplateTypes.Test.Plain]: [2, 69],
  [TemplateTypes.Text.After]: [
    30, 32, 36, 39, 84, 85, 40, 44, 45, 52, 53, 54, 55,
  ],
  [TemplateTypes.Text.Multi.Inline.N5After]: [10],
  [TemplateTypes.Text.Multi.Stack.N5After]: [8],
  [TemplateTypes.Text.Plain]: [
    1, 3, 4, 5, 6, 7, 9, 57, 58, 59, 60, 61, 62, 63, 64, 11, 12, 31, 33, 34, 35,
    37, 38, 86, 87, 88, 89, 90, 41, 42, 43, 46, 47, 48, 49, 50, 51,
  ],
  [TemplateTypes.AnswerCell.Plain]: [66, 67, 68],
  [TemplateTypes.AnswerCell.Multi.Stack.N2Plain]: [70, 71, 72, 73],
  [TemplateTypes.Table.Grid]: [56, '56_1'],
}

export default map
