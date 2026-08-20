import { describe, expect, it } from 'vitest'

import { classifyTableTemplate } from './classify-table-template'

describe('classifyTableTemplate', () => {
  it('falls back to table.plain when there is no table', () => {
    expect(classifyTableTemplate({})).toBe('table.plain')
    expect(classifyTableTemplate({ description: { type: 'text' } })).toBe(
      'table.plain',
    )
  })

  it('classifies table_1..6,8-shaped tasks (1 row, 1 answercell) as table.plain', () => {
    expect(
      classifyTableTemplate({
        description: {
          type: 'table',
          table: { rows: [{ cells: ['17010 + 15834 = ', 'answercell'] }] },
        },
      }),
    ).toBe('table.plain')
  })

  it('classifies table_9-shaped tasks (1 row, 2+ answercells) as table.inline', () => {
    expect(
      classifyTableTemplate({
        description: {
          type: 'table',
          table: {
            rows: [
              {
                cells: [
                  '8103',
                  'г',
                  ' = ',
                  'answercell',
                  'кг',
                  'answercell',
                  'г',
                ],
              },
            ],
          },
        },
      }),
    ).toBe('table.inline')
  })

  it('classifies table_13-shaped tasks (every row = [answercell, label]) as table.list', () => {
    expect(
      classifyTableTemplate({
        description: {
          type: 'table',
          table: {
            rows: [
              { cells: ['answercell', '- сотни тысяч'] },
              { cells: ['answercell', '- десятки тысяч'] },
              { cells: ['answercell', '- тысячи'] },
            ],
          },
        },
      }),
    ).toBe('table.list')
  })

  it('classifies table_7,10,12-shaped tasks (header rows + 1 data row with answercells) as table.grid', () => {
    expect(
      classifyTableTemplate({
        description: {
          type: 'table',
          table: {
            rows: [
              { cells: ['Первое слагаемое', 'Второе слагаемое', 'Сумма'] },
              { cells: ['9312', 'answercell', '37017'] },
            ],
          },
        },
      }),
    ).toBe('table.grid')

    expect(
      classifyTableTemplate({
        description: {
          type: 'table',
          table: {
            rows: [
              { cells: ['Класс', 'I класс'] },
              { cells: ['Разряды', 'сот.', 'дес.', 'ед.'] },
              { cells: ['Числа', 'answercell', 'answercell', 'answercell'] },
            ],
          },
        },
      }),
    ).toBe('table.grid')
  })

  it('classifies table_15-shaped tasks (header + repeating 1-answercell rows) as table.multiRow', () => {
    expect(
      classifyTableTemplate({
        description: {
          type: 'table',
          table: {
            rows: [
              { cells: ['Культура', 'Урожайность', 'Площадь', 'Масса'] },
              { cells: ['Ячмень', '25', '23', 'answercell'] },
              { cells: ['Пшеница', '84', 'answercell', '252'] },
              { cells: ['Просо', 'answercell', '41', '820'] },
            ],
          },
        },
      }),
    ).toBe('table.multiRow')
  })

  it('classifies table_14-shaped tasks (same as multiRow, but with an svg cell) as table.multiRowSvg', () => {
    expect(
      classifyTableTemplate({
        description: {
          type: 'table',
          table: {
            rows: [
              { cells: ['Колесо', 'Радиус', 'Диаметр'] },
              {
                cells: [
                  '<svg viewBox="0 0 150 150"></svg>',
                  '12',
                  'answercell',
                ],
              },
              {
                cells: [
                  '<svg viewBox="0 0 150 150"></svg>',
                  'answercell',
                  '26',
                ],
              },
            ],
          },
        },
      }),
    ).toBe('table.multiRowSvg')
  })

  it('classifies table_11-shaped tasks (heterogeneous rows) as table.mixed', () => {
    expect(
      classifyTableTemplate({
        description: {
          type: 'table',
          table: {
            rows: [
              { cells: ['v = ', 'answercell', 'изд./ч'] },
              { cells: ['t = ', 'answercell', 'ч'] },
              { cells: ['A =', '?'] },
              {
                cells: [
                  'A =',
                  'answercell',
                  '*',
                  'answercell',
                  '=',
                  'answercell',
                  'изд',
                ],
              },
            ],
          },
        },
      }),
    ).toBe('table.mixed')
  })
})
