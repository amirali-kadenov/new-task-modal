import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiStackN5After = createMultiTextTemplate({
  id: 'text.multi.stack.n5.after',
  layout: 'stack',
  inputCount: 5,
  withAfter: true,
})
