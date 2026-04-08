import { useId } from 'react'

import oneToZero from '@/assets/animations/lives/1-to-0.webp'
import twoToOne from '@/assets/animations/lives/2-to-1.webp'
import threeToTwo from '@/assets/animations/lives/3-to-2.webp'

import s from './heart-decrease-animation.module.scss'

interface Props {
  livesCount: number
  attemptsCount: number
}

export const HeartDecreaseAnimation = ({
  livesCount,
  attemptsCount,
}: Props) => {
  const id = useId()

  const src = getAnimationSrc(livesCount, attemptsCount)
  const srcWithCacheReset = `${src}#${id}`

  return (
    <div className={s.container}>
      <img src={srcWithCacheReset} alt="" className={s.img} />
    </div>
  )
}

const getAnimationSrc = (livesCount: number, attemptsCount: number) => {
  const livesLost = attemptsCount

  if (livesCount === 3) {
    const animations = [threeToTwo, twoToOne, oneToZero]
    return animations[livesLost - 1]
  }

  if (livesCount === 2) {
    const animations = [twoToOne, oneToZero]
    return animations[livesLost - 1]
  }

  if (livesCount === 1) {
    return oneToZero
  }
}
