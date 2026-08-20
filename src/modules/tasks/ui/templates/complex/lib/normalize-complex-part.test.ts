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
    expect((normalized.content as { module_name: string }).module_name).toBe(
      'Elixir.Helpers.Translation',
    )
    expect(normalized.repeatQuantity).toBe(2)
    expect(normalized).not.toHaveProperty('repeat_quantity')
  })

  it('keeps Translation.module_name intact inside table cells arrays (complex_5)', () => {
    const left = makeTranslation('4 \\(дм^3\\) = \\(\\ \\)')
    const right = makeTranslation('см³')
    const normalized = normalizeComplexPart({
      type: 120,
      remove_borders: true,
      rows: [
        {
          cells: [left, 'answercell', right],
        },
      ],
    })

    const cells = (normalized.rows as Array<{ cells: unknown[] }>)[0].cells
    expect(cells[0]).toBe(left)
    expect(cells[1]).toBe('answercell')
    expect(cells[2]).toBe(right)
    expect((cells[0] as { module_name: string }).module_name).toBe(
      'Elixir.Helpers.Translation',
    )
    expect(normalized.removeBorders).toBe(true)
  })
})
