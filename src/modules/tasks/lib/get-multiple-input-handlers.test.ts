import { describe, expect, it } from 'vitest'

import type { MathInputRef } from '@/ui/math-input/types'

import { collectMultiInputValues } from './get-multiple-input-handlers'
import { joinMultiAnswer, splitMultiAnswer } from './multi-answer'

const fakeField = (id: string, latex: string): MathInputRef => ({
  id,
  insertSymbol: () => undefined,
  setLatex: () => undefined,
  getLatex: () => latex,
  writeOnCursorPosition: () => undefined,
  focus: () => undefined,
})

describe('collectMultiInputValues', () => {
  it('pads a missing input1 so input2 stays in slot 1', () => {
    const map = new Map<string, MathInputRef>([
      ['input2', fakeField('input2', '42')],
    ])

    expect(collectMultiInputValues(map, 2)).toEqual(['', '42'])
  })

  it('keeps both slots when both fields are present', () => {
    const map = new Map<string, MathInputRef>([
      ['input2', fakeField('input2', '42')],
      ['input1', fakeField('input1', '7')],
    ])

    expect(collectMultiInputValues(map, 2)).toEqual(['7', '42'])
  })

  it('round-trips through join/split without shifting slots', () => {
    const map = new Map<string, MathInputRef>([
      ['input2', fakeField('input2', '5')],
    ])
    const joined = joinMultiAnswer(collectMultiInputValues(map, 2), ';;')
    expect(splitMultiAnswer(joined, ';;')).toEqual(['', '5'])
  })
})
