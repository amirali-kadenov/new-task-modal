import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.Text]: [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [TemplateTypes.AnswerCell]: [],
  [TemplateTypes.ColumnOperation]: [6, 7, 9, 10],
  [TemplateTypes.Comparison]: [
    '3_1', '3_2', '3_3', '3_4', '3_5', '3_6', '3_7', '3_8', '3_9', '3_10',
    '3_11', '3_12', '3_13', '3_14', '3_15', '3_16', '3_17', '3_18', '3_20'
  ],
}

export default map
