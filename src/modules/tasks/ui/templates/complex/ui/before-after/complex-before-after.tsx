import { createSimpleComplexTemplate } from '../../lib/create-simple-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexBeforeAfter = createSimpleComplexTemplate({
  id: 'complex.beforeAfter',
  withBefore: true,
  withAfter: true,
})
