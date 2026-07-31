import { createMultiAnswerCellTemplate } from '../../../lib/create-multi-answer-cell-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const AnswerCellMultiStackN2Plain = createMultiAnswerCellTemplate({
  id: 'answerCell.multi.stack.n2.plain',
  layout: 'stack',
  inputCount: 2,
})
