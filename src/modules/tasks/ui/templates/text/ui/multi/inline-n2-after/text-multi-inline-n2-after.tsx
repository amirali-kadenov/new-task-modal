import { createMultiTextTemplate } from '../../../lib/create-multi-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextMultiInlineN2After = createMultiTextTemplate({
  id: 'text.multi.inline.n2.after',
  layout: 'inline',
  inputCount: 2,
  withAfter: true,
})
