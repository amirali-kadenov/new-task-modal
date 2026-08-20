import { MathJax } from 'better-react-mathjax'
import clsx from 'clsx'

import styles from './math-text.module.scss'
import { normalizeFractionStyle } from './normalize-fraction-style'
import { scheduleMathStretch } from './stretch-tall-glyphs'

interface Props {
  children: string
  className?: string
  onTypeset?: () => void
}

export const MathFormula = ({ children, className, onTypeset }: Props) => {
  // Wrap first — normalizeFractionStyle only rewrites islands inside `\(...\)`.
  const content = normalizeFractionStyle(`\\(${children}\\)`)

  const handleTypeset = () => {
    scheduleMathStretch()
    onTypeset?.()
  }

  return (
    <MathJax
      className={clsx(styles.mathText, className)}
      inline
      onInitTypeset={handleTypeset}
      onTypeset={handleTypeset}
    >
      {content}
    </MathJax>
  )
}
