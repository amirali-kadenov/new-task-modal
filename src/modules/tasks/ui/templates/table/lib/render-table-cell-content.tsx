import { stripEmptyMathIslands } from '@/modules/tasks/ui/templates/text/lib/strip-empty-math-islands'
import { uprightUnitsInTex } from '@/modules/tasks/ui/templates/text/lib/upright-math-units'
import { MathFormula } from '@/ui/math-text/math-formula'
import { MathText } from '@/ui/math-text/math-text'

import styles from '../shared/table.module.scss'

/** ME parity: SVG / HTML markup must not go through MathText (escaped). */
export const isHtmlTableCellContent = (content: string): boolean =>
  content.includes('svg') || content.includes('<div')

const CYRILLIC_RE = /[а-яА-ЯёЁ]/

/**
 * MathJax math mode italicizes letters and `\text{…}` uses MJX text fonts
 * (not Halvar). Cyrillic prose labels in `\(…\)` are unwrapped to plain text
 * so they stay upright and inherit the UI font. Islands with `^` / `_`
 * (e.g. `дм^3`) stay in math mode with upright units via `\mathrm`.
 * Empty spacer islands from ME answer cells are dropped (they break typesetting).
 * Latin math like `\(v\)` / `\(t\)` is left unchanged.
 */
export const uprightCyrillicMath = (content: string): string => {
  const withUnits = content.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (match, inner: string) => {
      if (!CYRILLIC_RE.test(inner)) return match
      // Powers / subscripts must stay typeset (complex_5: `дм^3` → дм³).
      if (/[\^_]/.test(inner)) {
        return `\\(${uprightUnitsInTex(inner)}\\)`
      }
      let forText = inner.trim()
      const textWrapped = /^\\text\{([\s\S]*)\}$/.exec(forText)
      if (textWrapped) forText = textWrapped[1]
      // `\ ` is a LaTeX control space — drop the backslash
      return forText.replace(/\\ /g, ' ').replace(/\s+/g, ' ').trim()
    },
  )
  return stripEmptyMathIslands(withUnits)
}

interface StaticCellProps {
  content: string
  /** Solution row uses MathFormula for consistency with locked answers nearby. */
  asFormula?: boolean
}

/** Non-input cell: HTML injection for svg/div, else MathText/MathFormula. */
export const TableStaticCellContent = ({
  content,
  asFormula = false,
}: StaticCellProps) => {
  if (isHtmlTableCellContent(content)) {
    return (
      <div
        className={styles.htmlCell}
        data-testid="table-html-cell"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  const normalized = uprightCyrillicMath(content)

  if (asFormula) {
    return <MathFormula>{normalized}</MathFormula>
  }

  return <MathText>{normalized}</MathText>
}
