import { createSimpleTextTemplate } from '../../lib/create-simple-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextBeforeAfter = createSimpleTextTemplate({
  id: 'text.beforeAfter',
  withBefore: true,
  withAfter: true,
})
