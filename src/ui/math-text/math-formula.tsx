import { MathJax } from 'better-react-mathjax'
import clsx from 'clsx'

import styles from './math-text.module.scss'

interface Props {
  children: string
  className?: string
}

export const MathFormula = ({ children, className }: Props) => {
  return (
    <MathJax className={clsx(styles.mathText, className)} inline>
      {`\\(${children}\\)`}
    </MathJax>
  )
}
