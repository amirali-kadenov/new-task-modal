import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiInlineN3BeforeAfter = createMultiTextTemplate({
  id: 'text.multi.inline.n3.beforeAfter',
  layout: 'inline',
  inputCount: 3,
  withBefore: true,
  withAfter: true,
})
