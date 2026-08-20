import {
  uprightMathUnits,
  uprightUnitsInTex,
} from '@/modules/tasks/ui/templates/text/lib/upright-math-units'
import { MathFormula } from '@/ui/math-text/math-formula'
import { MathText } from '@/ui/math-text/math-text'

/**
 * CMS line-break marker `\(\\\)` between sentences.
 * Capture group keeps markers in the split result so they can be skipped.
 */
const LINE_BREAK_MARKER_SPLIT = /(\\\(\\\\\\\))/g
const LINE_BREAK_MARKER = '\\(\\\\\\)'

interface Props {
  content: string
  formulaClassName?: string
}

/**
 * Renders solution text content the same way the legacy TaskModal does
 * (`TaskSolution.renderContentByColumns`): the string is split by the CMS
 * line-break marker `\(\\\)` and each part becomes its own block, typeset
 * by MathJax independently. Mixed text with embedded `\(...\)` islands is
 * passed to `MathText` as-is — wrapping the whole string in `MathFormula`
 * would nest delimiters and break rendering.
 */
export const SolutionContentText = ({ content, formulaClassName }: Props) => {
  if (!content.trim()) return null

  // Raw TeX environment without inline delimiters needs explicit wrapping.
  if (content.includes('\\begin{') && !content.includes('\\(')) {
    return (
      <MathFormula className={formulaClassName}>
        {uprightUnitsInTex(content)}
      </MathFormula>
    )
  }

  const parts = content
    .split(LINE_BREAK_MARKER_SPLIT)
    .filter((part) => part !== LINE_BREAK_MARKER && part.trim() !== '')

  return (
    <>
      {parts.map((part, index) => (
        <div key={index}>
          <MathText inline>{uprightMathUnits(part)}</MathText>
        </div>
      ))}
    </>
  )
}
