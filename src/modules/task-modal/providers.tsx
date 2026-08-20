import { MathJaxContext, type MathJax3Config } from 'better-react-mathjax'

import { ReactQueryProvider } from '@/lib/providers/query-provider'

interface Props {
  children: React.ReactNode
}

const MATH_JAX_CONFIG: MathJax3Config = {
  loader: { load: ['input/tex', 'output/chtml'] },
  // `matchFontHeight` (default true) scales MathJax output to the actual
  // rendered font's ex-height so numbers/formulas match surrounding plain
  // text. Was off, so MathJax used its own fixed metrics — visibly smaller
  // and baseline-shifted vs plain text next to it (e.g. answer-cell
  // solution rows mixing plain-text and MathFormula-rendered numbers).
  chtml: { matchFontHeight: true },
  options: {
    renderActions: {
      addMenu: [], // disables MathJax context menu
    },
  },
}

export const TaskModalProviders = ({ children }: Props) => {
  return (
    <ReactQueryProvider>
      <MathJaxContext config={MATH_JAX_CONFIG}>{children}</MathJaxContext>
    </ReactQueryProvider>
  )
}
