import { describe, expect, it } from 'vitest'

import { vitestFileArgs, vitestFilterPattern } from './test-scope'

describe('vitestFileArgs', () => {
  it('returns empty when template is unset (full project collect)', () => {
    expect(vitestFileArgs('unit', 'allGroups', '')).toEqual([])
    expect(vitestFileArgs('interactions', 'allGroups', undefined)).toEqual([])
  })

  it('unit + template → catalog smoke only', () => {
    expect(vitestFileArgs('unit', 'allGroups', 'text/ui/after')).toEqual([
      'src/modules/testing/lib/catalog-smoke.unit.test.ts',
    ])
  })

  it('interactions + template → trainer stories of that template', () => {
    expect(
      vitestFileArgs('interactions', 'allGroups', 'text/ui/after'),
    ).toEqual([
      'src/modules/tasks/ui/templates/text/ui/after/trainer.stories.tsx',
    ])
    expect(vitestFileArgs('interactions', 'allTasks', 'table/ui/grid')).toEqual(
      ['src/modules/tasks/ui/templates/table/ui/grid/trainer.stories.tsx'],
    )
    expect(vitestFileArgs('interactions', 'all', 'text/ui/plain')).toEqual([
      'src/modules/tasks/ui/templates/text/ui/plain/trainer.stories.tsx',
    ])
  })
})

describe('vitestFilterPattern', () => {
  it('combines template key and allGroups scope markers', () => {
    const pat = vitestFilterPattern('allGroups', 'text/ui/after')
    expect(pat).toContain('text/ui/after')
    expect(pat).toContain('Templates/Text/after')
    expect(pat).toMatch(/allGroups|Groups/)
  })
})
