import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiStackN3Before = createMultiTextTemplate({
  id: 'text.multi.stack.n3.before',
  layout: 'stack',
  inputCount: 3,
  withBefore: true,
})
