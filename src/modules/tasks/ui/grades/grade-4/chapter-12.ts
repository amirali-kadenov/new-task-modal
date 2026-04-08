import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.Text]: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21,
    22, 23, 24,
  ],
  [TemplateTypes.AnswerCell]: [],
  [TemplateTypes.ColumnOperation]: [],
  [TemplateTypes.Comparison]: [
    '16_1', '16_2', '16_3', '16_4', '16_5', '16_6', '16_7', '16_8', '16_9',
    '16_10', '16_11', '16_12', '16_13', '16_14', '16_15', '16_16'
  ],
}

export default map
