import { MathJax } from 'better-react-mathjax'
import clsx from 'clsx'

import styles from './math-text.module.scss'
import { normalizeFractionStyle } from './normalize-fraction-style'
import { scheduleMathStretch } from './stretch-tall-glyphs'

interface Props {
  children: string
  className?: string
}

export const MathFormula = ({ children, className }: Props) => {
  // Wrap first — normalizeFractionStyle only rewrites islands inside `\(...\)`.
  const content = normalizeFractionStyle(`\\(${children}\\)`)

  return (
    <MathJax
      className={clsx(styles.mathText, className)}
      inline
      onInitTypeset={scheduleMathStretch}
      onTypeset={scheduleMathStretch}
    >
      {content}
    </MathJax>
  )
}
