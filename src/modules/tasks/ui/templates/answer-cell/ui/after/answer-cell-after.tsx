import { createSimpleAnswerCellTemplate } from '../../lib/create-simple-answer-cell-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const AnswerCellAfter = createSimpleAnswerCellTemplate({
  id: 'answerCell.after',
  withAfter: true,
})
