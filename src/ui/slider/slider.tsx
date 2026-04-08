import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import { useState, type ReactNode, type RefObject } from 'react'

import styles from './slider.module.scss'

interface Props {
  slides: ReactNode[]
  ref?: RefObject<HTMLDivElement | null>
  className?: string
}

const INITIAL = 1

export const Slider = ({ slides, ref, className }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(INITIAL)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    initial: INITIAL,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
  })

  const changeSlide = (index: number) => {
    instanceRef.current?.moveToIdx(index)
  }

  return (
    <div ref={ref} className={className}>
      <div ref={sliderRef} className="keen-slider">
        {slides.map((slide, index) => (
          <div key={index} className="keen-slider__slide">
            {slide}
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => changeSlide(index)}
            className={clsx(
              styles.dot,
              currentSlide === index ? styles.active : styles.inactive,
            )}
          />
        ))}
      </div>
    </div>
  )
}
