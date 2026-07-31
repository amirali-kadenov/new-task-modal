import { createMultiAnswerCellTemplate } from '../../../lib/create-multi-answer-cell-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const AnswerCellMultiInlineN2Plain = createMultiAnswerCellTemplate({
  id: 'answerCell.multi.inline.n2.plain',
  layout: 'inline',
  inputCount: 2,
})
