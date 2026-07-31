import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.Text.Plain]: [
    28, 29, 31, 32, 33, 35, 39, 48,
    49, 50, 51, 52, 53, 54, 56,
  ],
  [TemplateTypes.Text.After]: [
    27, 30, 36, 37, 38, 40, 41, 42,
    43, 44, 45, 46, 47, 55, 57, 58,
    59, 60,
  ],
  [TemplateTypes.Formula.Plain]: [
    '1_1', '1_2', 6, 7,
  ],
  [TemplateTypes.ColumnOperation.Plain]: [
    3, 4,
  ],
  [TemplateTypes.ColumnOperation.Multi.Stack.N2Before]: [
    16,
  ],
  [TemplateTypes.Table.Plain]: [
    '1_3', '1_4', '1_5', '1_6', '1_7', '2_1', '2_2', '2_3',
    '2_4', '2_5', '2_6', 8, 9, 10, 11, 12,
    13, 14, 15, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26,
  ],
}

export default map
