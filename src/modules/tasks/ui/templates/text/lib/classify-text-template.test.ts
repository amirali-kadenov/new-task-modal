import { describe, expect, it } from 'vitest'

import afterFixture from '../ui/after/data/task.json'
import aiTranslationFixture from '../ui/ai-translation/data/task.json'
import beforeFixture from '../ui/before/data/task.json'
import beforeAfterFixture from '../ui/before-after/data/task.json'
import inlineN2AfterFixture from '../ui/multi/inline-n2-after/data/task.json'
import inlineN3BeforeAfterFixture from '../ui/multi/inline-n3-before-after/data/task.json'
import inlineN5AfterFixture from '../ui/multi/inline-n5-after/data/task.json'
import stackN2AfterFixture from '../ui/multi/stack-n2-after/data/task.json'
import stackN2BeforeFixture from '../ui/multi/stack-n2-before/data/task.json'
import stackN2BeforeAfterFixture from '../ui/multi/stack-n2-before-after/data/task.json'
import stackN3BeforeFixture from '../ui/multi/stack-n3-before/data/task.json'
import stackN3BeforeAfterFixture from '../ui/multi/stack-n3-before-after/data/task.json'
import stackN4AfterFixture from '../ui/multi/stack-n4-after/data/task.json'
import stackN5AfterFixture from '../ui/multi/stack-n5-after/data/task.json'
import plainFixture from '../ui/plain/data/task.json'

import { classifyTextTemplate } from './classify-text-template'

const cases: [string, { answerInput?: unknown }][] = [
  ['text.plain', plainFixture],
  ['text.before', beforeFixture],
  ['text.after', afterFixture],
  ['text.beforeAfter', beforeAfterFixture],
  ['text.aiTranslation', aiTranslationFixture],
  ['text.multi.stack.n2.before', stackN2BeforeFixture],
  ['text.multi.stack.n2.after', stackN2AfterFixture],
  ['text.multi.stack.n2.beforeAfter', stackN2BeforeAfterFixture],
  ['text.multi.stack.n3.before', stackN3BeforeFixture],
  ['text.multi.stack.n3.beforeAfter', stackN3BeforeAfterFixture],
  ['text.multi.stack.n4.after', stackN4AfterFixture],
  ['text.multi.stack.n5.after', stackN5AfterFixture],
  ['text.multi.inline.n2.after', inlineN2AfterFixture],
  ['text.multi.inline.n3.beforeAfter', inlineN3BeforeAfterFixture],
  ['text.multi.inline.n5.after', inlineN5AfterFixture],
]

describe('classifyTextTemplate', () => {
  it.each(cases)('%s', (expected, fixture) => {
    expect(classifyTextTemplate(fixture)).toBe(expected)
  })

  it('answerInput отсутствует → text.plain', () => {
    expect(classifyTextTemplate({})).toBe('text.plain')
    expect(classifyTextTemplate({ answerInput: undefined })).toBe('text.plain')
  })

  it('пустые before/after (включая пустой Translation) → plain', () => {
    expect(
      classifyTextTemplate({
        answerInput: {
          type: 10,
          before: '  ',
          after: {
            module_name: 'Elixir.Helpers.Translation',
            rus: '',
            kaz: ' ',
          },
          text: ' ',
          down: '',
          up: '',
          svg: '',
        },
      }),
    ).toBe('text.plain')
  })

  it('неизвестная multi-форма строит id по данным (n6)', () => {
    const input = {
      before: '',
      after: 'кг',
      text: '',
      down: '',
      up: '',
      svg: '',
      type: 10,
    }
    expect(
      classifyTextTemplate({
        answerInput: {
          type: 70,
          inline: false,
          input1: input,
          input2: input,
          input3: input,
          input4: input,
          input5: input,
          input6: input,
        },
      }),
    ).toBe('text.multi.stack.n6.after')
  })
})
