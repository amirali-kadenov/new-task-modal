import { describe, expect, it } from 'vitest'

import { TEMPLATE_MAP } from './template-map'
import { TemplateTypes } from './template-types'

const flattenLeafIds = (value: unknown): string[] => {
  if (typeof value === 'string') return [value]
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(flattenLeafIds)
  }
  return []
}

const leafIds = flattenLeafIds(TemplateTypes)

describe('TEMPLATE_MAP', () => {
  it('covers every TemplateTypes leaf', () => {
    expect(Object.keys(TEMPLATE_MAP).sort()).toEqual([...leafIds].sort())
  })

  it.each(leafIds)('loads %s', async (type) => {
    const module = await TEMPLATE_MAP[type as keyof typeof TEMPLATE_MAP]()

    expect(module.default).toBeDefined()
  })
})
