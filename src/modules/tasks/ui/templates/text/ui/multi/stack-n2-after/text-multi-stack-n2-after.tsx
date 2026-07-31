import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiStackN2After = createMultiTextTemplate({
  id: 'text.multi.stack.n2.after',
  layout: 'stack',
  inputCount: 2,
  withAfter: true,
})
