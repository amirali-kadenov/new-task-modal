import { describe, expect, it } from 'vitest'

import { prepareColumnOperationMath } from './prepare-column-operation-math'

const plusSnippet = `\\begin{array}{c}
\\phantom{99}67045\\\\[-6pt]
\\underline{
  {}^{{}^{{}^{+}}}
  \\smash{\\phantom{99999}7}
}\\\\[-6pt]


\\end{array}
`

const minusSnippet = `\\begin{array}{c}
\\phantom{99}72222\\\\[-6pt]
\\underline{
  {}^{{}^{{}^{-}}}
  \\smash{\\phantom{99999}4}
}\\\\[-6pt]


\\end{array}
`

const timesSnippet = `\\begin{array}{c}
\\phantom{99}42316\\\\[-6pt]
\\underline{
  {}^{{}^{{}^{\\times}}}
  \\smash{\\phantom{99999}2}
}\\\\[-6pt]

\\end{array}
`

const divSnippet = `\\begin{array}{c}
\\left. {\\phantom{99}30202}
\\right\\vert{\\underline{2}}
\\end{array}\\\\
`

describe('prepareColumnOperationMath', () => {
  it('enlarges + − × from nested superscripts to textstyle', () => {
    expect(prepareColumnOperationMath(plusSnippet)).toContain(
      '{}^{{\\textstyle +}}',
    )
    expect(prepareColumnOperationMath(plusSnippet)).not.toContain(
      '{}^{{}^{{}^{+}}}',
    )

    expect(prepareColumnOperationMath(minusSnippet)).toContain(
      '{}^{{\\textstyle -}}',
    )
    expect(prepareColumnOperationMath(minusSnippet)).not.toContain(
      '{}^{{}^{{}^{-}}}',
    )

    expect(prepareColumnOperationMath(timesSnippet)).toContain(
      '{}^{{\\textstyle \\times}}',
    )
    expect(prepareColumnOperationMath(timesSnippet)).not.toContain(
      '{}^{{}^{{}^{\\times}}}',
    )
  })

  it('strips trailing breaks after end{array} without rewriting division', () => {
    const result = prepareColumnOperationMath(divSnippet)
    expect(result).toContain('\\left.')
    expect(result).toContain('\\right\\vert')
    expect(result).toContain('\\underline{2}')
    expect(result).not.toMatch(/\\end\{array\}\s*\\\\/)
  })

  it('returns empty string unchanged', () => {
    expect(prepareColumnOperationMath('')).toBe('')
    expect(prepareColumnOperationMath('   ')).toBe('')
  })
})
