import { createSimpleAnswerCellTemplate } from '../../lib/create-simple-answer-cell-template'

/**
 * Same as `answerCell.plain`, but keeps the solution-mode content row
 * centered instead of end-aligned. Used for the answerCell_5 task group
 * (4_11_3_3, 4_11_3_4, 4_12_19_2..19_7) — see grade-4 chapter-11/chapter-12
 * routing.
 */
export const AnswerCellPlainCenter = createSimpleAnswerCellTemplate({
  id: 'answerCell.plain.center',
  solutionAlignCenter: true,
})
