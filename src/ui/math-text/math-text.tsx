import { MathJax } from 'better-react-mathjax'
import clsx from 'clsx'
import { type ComponentProps } from 'react'

import styles from './math-text.module.scss'
import { normalizeFractionStyle } from './normalize-fraction-style'
import { scheduleMathStretch } from './stretch-tall-glyphs'

type Props = ComponentProps<typeof MathJax> & {
  inline?: boolean
}

/**
 * `-webkit-touch-callout` (`@supports` feature-query) only reliably detects
 * iOS Safari, not desktop macOS Safari — UA sniffing is what the rest of the
 * codebase uses for this (see `src/ui/spoiler/spoiler.tsx`).
 */
const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const MathText = ({ children, className, inline, onTypeset }: Props) => {
  const content =
    typeof children === 'string' ? normalizeFractionStyle(children) : children

  const handleTypeset = () => {
    scheduleMathStretch()
    onTypeset?.()
  }

  return (
    <MathJax
      className={clsx(styles.mathText, IS_SAFARI && styles.safari, className)}
      inline={inline}
      onInitTypeset={handleTypeset}
      onTypeset={handleTypeset}
    >
      {content}
    </MathJax>
  )
}
