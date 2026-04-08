import 'keen-slider/keen-slider.min.css'
import { useMemo, useState, type RefObject } from 'react'

import type { Global } from '@/types/global'
import { Slider } from '@/ui/slider/slider'

import { Keyboard } from './keyboard'
import { CALC_MODE } from './model/constants'
import { ARROW_UP_ACTION, LETTERS } from './model/symbols/letters'
import { MAIN } from './model/symbols/main'
import type { CalculatorSymbol } from './model/symbols/types'

interface Props {
  global: Global
  onInput: (input: string) => void
  ref?: RefObject<HTMLDivElement | null>
  className?: string
}

export const Calculator = ({ global, onInput, ref, className }: Props) => {
  const [isUppercase, setIsUppercase] = useState(false)

  const translate = global.translate

  const mainKeys = useMemo(() => {
    return MAIN.map((symbol) => {
      if (symbol.withTranslation) {
        return { ...symbol, title: translate(symbol.title) }
      }

      return symbol
    })
  }, [translate])

  const letterKeys = useMemo(() => {
    return LETTERS.map((symbol) => {
      if (isUppercase) {
        return { ...symbol, ...symbol.upperCased }
      }

      return symbol
    })
  }, [isUppercase])

  const handleKeyPress = (key: CalculatorSymbol | string) => {
    const isSymbol = typeof key === 'object'

    if (!isSymbol) {
      onInput(key)
      return
    }

    if (key.action === ARROW_UP_ACTION) {
      setIsUppercase((prev) => !prev)
      return
    }

    if (key.latex) {
      onInput(key.latex)
    } else {
      onInput(key.title)
    }
  }

  return (
    <Slider
      className={className}
      ref={ref}
      slides={[
        <Keyboard
          key={CALC_MODE.LETTERS}
          mode={CALC_MODE.LETTERS}
          keys={letterKeys}
          onKeyPress={handleKeyPress}
        />,
        <Keyboard
          key={CALC_MODE.MAIN}
          mode={CALC_MODE.MAIN}
          keys={mainKeys}
          onKeyPress={handleKeyPress}
        />,
      ]}
    />
  )
}
