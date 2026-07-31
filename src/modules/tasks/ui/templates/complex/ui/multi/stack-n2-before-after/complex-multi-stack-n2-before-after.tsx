import { createMultiComplexTemplate } from '../../../lib/create-multi-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexMultiStackN2BeforeAfter = createMultiComplexTemplate({
  id: 'complex.multi.stack.n2.beforeAfter',
  layout: 'stack',
  inputCount: 2,
  withBefore: true,
  withAfter: true,
})
