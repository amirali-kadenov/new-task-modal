import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.ColumnOperation.Plain]: [33, 34],
  [TemplateTypes.Comparison.Plain]: [12],
  [TemplateTypes.Table.Plain]: [
    55,
    56,
    57,
    '57_1',
    65,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
  ],
  [TemplateTypes.Test.Plain]: [2],
  [TemplateTypes.Text.After]: [41, 43, 44, 51, 54],
  [TemplateTypes.Text.Plain]: [
    1, 3, 4, 5, 6, 7, 8, 9, 58, 59, 60, 61, 62, 63, 64, 10, 11, 35, 36, 37, 38,
    39, 40, 42, 45, 46, 47, 48, 49, 50, 52, 53,
  ],
}

export default map
