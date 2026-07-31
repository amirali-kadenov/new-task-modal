import { describe, expect, it } from 'vitest'

import { hasTaskContainerOverflow } from './get-calc-overflow-handler'

describe('hasTaskContainerOverflow', () => {
  it('is true when scrollHeight exceeds clientHeight', () => {
    const el = {
      clientHeight: 100,
      scrollHeight: 250,
    } as HTMLDivElement
    expect(hasTaskContainerOverflow(el)).toBe(true)
  })

  it('is false when content fits', () => {
    const el = {
      clientHeight: 200,
      scrollHeight: 200,
    } as HTMLDivElement
    expect(hasTaskContainerOverflow(el)).toBe(false)
  })
})
