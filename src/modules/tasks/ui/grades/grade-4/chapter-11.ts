import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.Text]: [2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21],
  [TemplateTypes.AnswerCell]: [1, 9],
  [TemplateTypes.ColumnOperation]: [],
  [TemplateTypes.Comparison]: [
    '8_1', '18_1', '18_2', '18_3', '18_4', '18_5', '18_6', '18_7', '18_8',
    '18_9', '18_10', '18_11', '18_12', '18_13', '18_14', '18_15'
  ],
}

export default map
