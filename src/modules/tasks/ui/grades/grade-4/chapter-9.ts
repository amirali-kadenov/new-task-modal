import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.Text]: [1, 2, 3, 4, 13, 14, 15, 16],
  [TemplateTypes.AnswerCell]: [],
  [TemplateTypes.ColumnOperation]: [5, 6, 7, 8, 9, 10, 11, 12],
  [TemplateTypes.Comparison]: ['4_1'],
}

export default map
