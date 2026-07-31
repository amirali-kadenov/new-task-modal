import { MathJax } from 'better-react-mathjax'
import clsx from 'clsx'
import { type ComponentProps } from 'react'

import styles from './math-text.module.scss'
import { normalizeFractionStyle } from './normalize-fraction-style'
import { scheduleMathStretch } from './stretch-tall-glyphs'

type Props = ComponentProps<typeof MathJax> & {
  inline?: boolean
}

export const MathText = ({ children, className, inline }: Props) => {
  const content =
    typeof children === 'string' ? normalizeFractionStyle(children) : children

  return (
    <MathJax
      className={clsx(styles.mathText, className)}
      inline={inline}
      onInitTypeset={scheduleMathStretch}
      onTypeset={scheduleMathStretch}
    >
      {content}
    </MathJax>
  )
}
