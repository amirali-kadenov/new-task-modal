import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.Text]: [
    1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    24, 25, 26, 27, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
    45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 57, 58, 59, 60, 61, 62, 63, 64,
    74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
  ],
  [TemplateTypes.Test]: [2, 69],
  [TemplateTypes.AnswerCell]: [66, 67, 68, 70, 71, 72, 73],
  [TemplateTypes.ColumnOperation]: [28, 29],
  [TemplateTypes.Comparison]: [13],
  [TemplateTypes.Table]: [56, '56_1'],
}

export default map
