import { describe, expect, it } from 'vitest'

import { classifyColumnOperationTemplate } from './classify-column-operation-template'

describe('classifyColumnOperationTemplate', () => {
  it('maps empty / type-10 plain answerInput to columnOperation.plain', () => {
    expect(classifyColumnOperationTemplate({})).toBe('columnOperation.plain')
    expect(
      classifyColumnOperationTemplate({
        answerInput: {
          type: 10,
          before: '',
          after: '',
          text: ' ',
          down: '',
          up: '',
          svg: '',
        },
      }),
    ).toBe('columnOperation.plain')
  })

  it('maps input1/input2 with before and inline:false to multi.stack.n2.before', () => {
    expect(
      classifyColumnOperationTemplate({
        answerInput: {
          type: 20,
          inline: false,
          input1: {
            type: 10,
            before: { rus: 'Значение частного: ', module_name: 'T' },
            after: '',
          },
          input2: {
            type: 10,
            before: { rus: 'Значение остатка: ', module_name: 'T' },
            after: '',
          },
        },
      }),
    ).toBe('columnOperation.multi.stack.n2.before')
  })
})
