import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.Text]: [
    1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21,
  ],
  [TemplateTypes.AnswerCell]: [20],
  [TemplateTypes.ColumnOperation]: [9],
  [TemplateTypes.Comparison]: [
    '8_1', '8_2', '8_3', '8_4', '8_5', '8_6', '8_7', '8_8', '8_9', '8_10',
    '8_11', '8_12', '8_13', '8_14', '8_15', '8_16', '8_17', '8_18', '8_19', '8_20'
  ],
}

export default map
