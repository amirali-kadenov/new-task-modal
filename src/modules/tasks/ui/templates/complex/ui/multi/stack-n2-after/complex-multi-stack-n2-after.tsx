import { createMultiComplexTemplate } from '../../../lib/create-multi-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexMultiStackN2After = createMultiComplexTemplate({
  id: 'complex.multi.stack.n2.after',
  layout: 'stack',
  inputCount: 2,
  withAfter: true,
})
