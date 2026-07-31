import { TemplateTypes } from '../../../model/template-types.ts'

const map = {
  [TemplateTypes.Text.Plain]: [
    '12_3', '12_5', '12_8', '12_9', '13_1', '13_3', '13_4', '13_5',
    '13_7', '1_1', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6',
    '2_7', '2_8', '2_9', '3_1', '3_2',
  ],
  [TemplateTypes.Text.After]: [
    '12_1', '12_2', '12_4', '12_6', '12_7', '13_2', '13_6',
  ],
  [TemplateTypes.Complex.Plain]: [
    '5_1', '5_2', '5_3', '5_4', '5_5', '5_6', '5_7', '5_8',
  ],
  [TemplateTypes.ColumnOperation.Plain]: [
    '10_1', '6_1', '7_1', '9_1',
  ],
  [TemplateTypes.Comparison.Plain]: [
    '4_1',
  ],
  [TemplateTypes.Test.Plain]: [
    '1_2',
  ],
}

export default map
