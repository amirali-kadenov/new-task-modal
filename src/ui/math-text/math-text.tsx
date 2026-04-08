import { MathJax } from 'better-react-mathjax'
import clsx from 'clsx'
import { type ComponentProps } from 'react'

import styles from './math-text.module.scss'

type Props = ComponentProps<typeof MathJax> & {
  inline?: boolean
}

export const MathText = ({ children, className, inline }: Props) => {
  return (
    <MathJax className={clsx(styles.mathText, className)} inline={inline}>
      {children}
    </MathJax>
  )
}
