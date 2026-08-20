import clsx from 'clsx'
import { useState, type ReactNode } from 'react'
import { Spoiler } from 'spoiled'

import spoilerDotsSrc from '@/assets/images/spoiler-dots.png'

import styles from './spoiler.module.scss'

const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

interface Props {
  children: ReactNode
}

export const SpoilerText = ({ children }: Props) => {
  const [hidden, setHidden] = useState(true)

  return (
    <Spoiler
      // Block children (MathText / SolutionExplanation) are invalid inside <span>.
      tagName="div"
      forceFallback={IS_SAFARI}
      accentColor={'black'}
      theme="dark"
      hidden={hidden}
      className={clsx(
        styles.spoiler,
        hidden && IS_SAFARI && styles.withPulse,
        hidden && styles.cursor,
      )}
      onClick={() => setHidden(false)}
      fallback={
        IS_SAFARI && `repeat top left / 16px 16px url(${spoilerDotsSrc})`
      }
    >
      {children}
    </Spoiler>
  )
}
