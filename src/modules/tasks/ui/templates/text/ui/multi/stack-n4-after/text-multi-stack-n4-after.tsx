import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiStackN4After = createMultiTextTemplate({
  id: 'text.multi.stack.n4.after',
  layout: 'stack',
  inputCount: 4,
  withAfter: true,
})
