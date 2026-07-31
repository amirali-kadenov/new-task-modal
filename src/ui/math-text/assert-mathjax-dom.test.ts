import { describe, expect, it } from 'vitest'

import {
  assertMathGlyphFontConsistent,
  assertMathSizeMatchesProse,
  assertNoAnswerSeparator,
  assertNoMathJaxErrors,
  assertNoRawMathDelimiters,
  assertUprightUnit,
} from './assert-mathjax-dom'

describe('assertNoMathJaxErrors', () => {
  it('passes when no mjx-merror', () => {
    const root = document.createElement('div')
    root.innerHTML = '<mjx-container><mjx-math /></mjx-container>'
    expect(() => assertNoMathJaxErrors(root)).not.toThrow()
  })

  it('fails on mjx-merror (double-wrap regression)', () => {
    const root = document.createElement('div')
    root.innerHTML = '<mjx-merror>\\(</mjx-merror>'
    expect(() => assertNoMathJaxErrors(root)).toThrow(/mjx-merror/)
  })
})

describe('assertNoRawMathDelimiters', () => {
  it('passes when delimiters were typeset away', () => {
    const root = document.createElement('div')
    root.innerHTML = '<mjx-container><mjx-math>x</mjx-math></mjx-container>'
    expect(() => assertNoRawMathDelimiters(root)).not.toThrow()
  })

  it('fails on leftover \\)', () => {
    const root = document.createElement('div')
    root.appendChild(document.createTextNode('\\)'))
    expect(() => assertNoRawMathDelimiters(root)).toThrow(/raw/)
  })
})

describe('assertNoAnswerSeparator', () => {
  it('passes when only the primary answer is rendered', () => {
    const root = document.createElement('div')
    root.textContent = 'Правильный ответ: a : 6'
    expect(() => assertNoAnswerSeparator(root)).not.toThrow()
  })

  it.each(['a : 6 || a/6', 'a : 6 ‖ a/6', 'a : 6 ∥ a/6'])(
    'fails on unresolved alternative separator in %s',
    (text) => {
      const root = document.createElement('div')
      root.textContent = text
      expect(() => assertNoAnswerSeparator(root)).toThrow(
        /alternative separator/,
      )
    },
  )
})

describe('assertUprightUnit', () => {
  it('passes for upright дм', () => {
    const root = document.createElement('div')
    root.innerHTML =
      '<mjx-container><mjx-mtext class="mjx-n">дм</mjx-mtext></mjx-container>'
    expect(() => assertUprightUnit(root, 'дм')).not.toThrow()
  })

  it('fails when д is italic next to upright м (text_16 split)', () => {
    const root = document.createElement('div')
    root.innerHTML =
      '<mjx-container><mjx-mi class="mjx-i">д</mjx-mi><mjx-mtext class="mjx-n">м</mjx-mtext></mjx-container>'
    expect(() => assertUprightUnit(root, 'дм')).toThrow(/split|italic/)
  })
})

describe('assertMathGlyphFontConsistent', () => {
  const mountUtextNextToGlyph = (utextFont: string, glyphFont: string) => {
    const root = document.createElement('div')
    root.innerHTML =
      '<mjx-container><mjx-mi><mjx-utext>с</mjx-utext></mjx-mi><mjx-c></mjx-c></mjx-container>'
    root
      .querySelector('mjx-utext')
      ?.setAttribute('style', `font-family: ${utextFont}`)
    root
      .querySelector('mjx-c')
      ?.setAttribute('style', `font-family: ${glyphFont}`)
    document.body.appendChild(root)
    return root
  }

  it('passes when cyrillic uses the same family as latin glyphs', () => {
    const root = mountUtextNextToGlyph(
      'MJXZERO, "Halvar Mittel", sans-serif',
      '"Halvar Mittel", sans-serif, MJXZERO',
    )
    expect(() => assertMathGlyphFontConsistent(root)).not.toThrow()
  })

  it('fails when mjx-utext falls back to serif (text_6)', () => {
    const root = mountUtextNextToGlyph(
      'MJXZERO, serif',
      '"Halvar Mittel", sans-serif, MJXZERO',
    )
    expect(() => assertMathGlyphFontConsistent(root)).toThrow(/unknownFamily/)
  })
})

describe('assertMathSizeMatchesProse', () => {
  const mountFraction = (prosePx: number, glyphPx: number) => {
    const root = document.createElement('div')
    root.style.fontSize = `${prosePx}px`
    root.innerHTML =
      '<mjx-container><mjx-num><mjx-c class="mjx-c33"></mjx-c></mjx-num><mjx-den><mjx-c class="mjx-c35"></mjx-c></mjx-den></mjx-container>'
    root.querySelectorAll('mjx-c').forEach((el) => {
      ;(el as HTMLElement).style.fontSize = `${glyphPx}px`
    })
    document.body.appendChild(root)
    return root
  }

  it('passes when num/den match prose (dfrac)', () => {
    const root = mountFraction(16, 16)
    expect(() => assertMathSizeMatchesProse(root)).not.toThrow()
  })

  it('fails when num/den are scriptstyle (frac)', () => {
    const root = mountFraction(16, 11.312)
    expect(() => assertMathSizeMatchesProse(root)).toThrow(/dfrac|ratio/)
  })
})
