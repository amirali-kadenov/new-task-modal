import { createSimpleComplexTemplate } from '../../lib/create-simple-complex-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ComplexAfterEquation = createSimpleComplexTemplate({
  id: 'complex.after.equation',
  withAfter: true,
  equationLayout: true,
})
