import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiStackN2BeforeAfter = createMultiTextTemplate({
  id: 'text.multi.stack.n2.beforeAfter',
  layout: 'stack',
  inputCount: 2,
  withBefore: true,
  withAfter: true,
})
