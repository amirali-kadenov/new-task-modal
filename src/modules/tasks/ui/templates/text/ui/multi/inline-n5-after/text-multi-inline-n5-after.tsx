import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiInlineN5After = createMultiTextTemplate({
  id: 'text.multi.inline.n5.after',
  layout: 'inline',
  inputCount: 5,
  withAfter: true,
})
