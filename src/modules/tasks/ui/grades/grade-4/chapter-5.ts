import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.Text]: [
    1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
  ],
  [TemplateTypes.Test]: [],
  [TemplateTypes.AnswerCell]: [],
  [TemplateTypes.ColumnOperation]: [3, 4, 14],
  [TemplateTypes.Comparison]: [12],
}

export default map
