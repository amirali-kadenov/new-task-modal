import { describe, expect, it } from 'vitest'

import { makeTranslation } from '@/modules/tasks/ui/templates/shared/testing/make-task-modal-deps'

import { normalizeComplexPart } from './normalize-complex-part'

describe('normalizeComplexPart', () => {
  it('keeps Translation.module_name intact inside content', () => {
    const translation = makeTranslation('Сколько клеток?')
    const normalized = normalizeComplexPart({
      type: 10,
      content: translation,
      repeat_quantity: 2,
    })

    expect(normalized.content).toBe(translation)
    expect(
      (normalized.content as { module_name: string }).module_name,
    ).toBe('Elixir.Helpers.Translation')
    expect(normalized.repeatQuantity).toBe(2)
    expect(normalized).not.toHaveProperty('repeat_quantity')
  })
})
