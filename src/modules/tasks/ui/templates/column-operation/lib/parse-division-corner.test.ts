import { describe, expect, it } from 'vitest'

import { parseDivisionCorner, stripPhantoms } from './parse-division-corner'

const divSnippet = `\\begin{array}{c}
\\left. {\\phantom{99}30202}
\\right\\vert{\\underline{2}}
\\end{array}\\\\
`

const divSolutionSnippet = `\\begin{array}{c}
\\left. {\\phantom{99}30202}
\\right\\vert{\\Large{\\frac{2}{15101}}}
\\end{array}\\\\
`

const fixture48849 = `\\begin{array}{c}
\\left. {\\phantom{99}48849}
\\right\\vert{\\underline{2}}
\\end{array}\\\\
`

const fixture8395 = `\\begin{array}{c}
\\left. {\\phantom{99}8395}
\\right\\vert{\\Large{\\frac{357}{23}}}
\\end{array}\\\\
`

const arabicOverline = `\\begin{array}{}
{2} \\vert \\overline{\\phantom{9}48849}
\\end{array}
`

describe('stripPhantoms', () => {
  it('removes phantom padding', () => {
    expect(stripPhantoms('\\phantom{99}30202')).toBe('30202')
    expect(stripPhantoms('\\phantom{9}48849')).toBe('48849')
  })
})

describe('parseDivisionCorner', () => {
  it('parses question form with underline divisor', () => {
    expect(parseDivisionCorner(divSnippet)).toEqual({
      dividend: '30202',
      divisor: '2',
    })
  })

  it('parses solution form with Large frac', () => {
    expect(parseDivisionCorner(divSolutionSnippet)).toEqual({
      dividend: '30202',
      divisor: '2',
      quotient: '15101',
    })
  })

  it('injects solution quotient when CMS is question form', () => {
    expect(parseDivisionCorner(divSnippet, { quotient: '15101' })).toEqual({
      dividend: '30202',
      divisor: '2',
      quotient: '15101',
    })
  })

  it('parses stack-n2 fixture 48849|2', () => {
    expect(parseDivisionCorner(fixture48849)).toEqual({
      dividend: '48849',
      divisor: '2',
    })
  })

  it('parses multi-digit divisor solution 8395|357', () => {
    expect(parseDivisionCorner(fixture8395)).toEqual({
      dividend: '8395',
      divisor: '357',
      quotient: '23',
    })
  })

  it('returns null for Arabic overline layout', () => {
    expect(parseDivisionCorner(arabicOverline)).toBeNull()
  })

  it('returns null for empty / non-division tex', () => {
    expect(parseDivisionCorner('')).toBeNull()
    expect(parseDivisionCorner('\\begin{array}{c}1+1\\end{array}')).toBeNull()
  })
})
