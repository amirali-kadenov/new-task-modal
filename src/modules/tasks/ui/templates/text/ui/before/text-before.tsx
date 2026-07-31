import { createSimpleTextTemplate } from '../../lib/create-simple-text-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const TextBefore = createSimpleTextTemplate({
  id: 'text.before',
  withBefore: true,
})
