import { createMultiColumnOperationTemplate } from '../../../lib/create-multi-column-operation-template'

/** См. `./README.md` и пример payload в `./data/task.json`. */
export const ColumnOperationMultiStackN2Before =
  createMultiColumnOperationTemplate({
    id: 'columnOperation.multi.stack.n2.before',
    layout: 'stack',
    inputCount: 2,
    withBefore: true,
  })
