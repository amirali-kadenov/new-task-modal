import { createMultiFormulaTemplate } from '../../../lib/create-multi-formula-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const FormulaMultiStackN2Before = createMultiFormulaTemplate({
  id: 'formula.multi.stack.n2.before',
  layout: 'stack',
  inputCount: 2,
  withBefore: true,
})
