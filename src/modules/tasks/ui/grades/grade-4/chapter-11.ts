import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.Text.Plain]: [
    '11_1', '11_2', '11_3', '11_4', '11_7', '11_8', '19_12', '19_4',
    '19_6', '19_7', '19_8', '20_10', '20_11', '20_12', '20_4', '20_5',
    '20_6', '20_7', '2_1', '2_2', '2_3', '2_4', '5_1', '5_2',
    '5_3', '5_4',
  ],
  [TemplateTypes.Text.After]: [
    '11_5', '11_6', '19_1', '19_10', '19_11', '19_2', '19_3', '19_5',
    '20_1', '20_2', '20_3', '20_8', '20_9', '3_2', '6_1', '6_2',
    '6_3', '6_4',
  ],
  [TemplateTypes.Formula.Plain]: [
    12, 13, 14, 15, 16, '17_1', '17_2', '2_5',
    '2_6',
  ],
  [TemplateTypes.Formula.After]: [
    '3_1',
  ],
  [TemplateTypes.Complex.Plain]: [
    '1_1', '1_2', '1_3', '1_4',
  ],
  [TemplateTypes.Complex.After]: [
    '10_1', '10_2', '10_3', '10_4', '4_1', '4_2', '4_3',
  ],
  [TemplateTypes.AnswerCell.Plain]: [
    '3_3', '3_4',
  ],
  [TemplateTypes.Comparison.Plain]: [
    '18_1', '18_10', '18_11', '18_12', '18_13', '18_14', '18_15', '18_2',
    '18_3', '18_4', '18_5', '18_6', '18_7', '18_8', '18_9', '8_1',
  ],
  [TemplateTypes.Test.Plain]: [
    '7_1', '7_2',
  ],
}

export default map
