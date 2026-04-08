import clsx from 'clsx'

import styles from './keyboard.module.scss'
import { CALC_MODE, NUMBERS, OPERATORS } from './model/constants'
import type { CalculatorSymbol } from './model/symbols/types'

type KeyboardMode = (typeof CALC_MODE)[keyof typeof CALC_MODE]

interface Props {
  keys: CalculatorSymbol[]
  mode: KeyboardMode
  onKeyPress: (key: CalculatorSymbol | string) => void
}

export const Keyboard = ({ keys, mode, onKeyPress }: Props) => {
  const isLetters = mode === CALC_MODE.LETTERS
  const isMain = mode === CALC_MODE.MAIN

  return (
    <div className={clsx(styles.keyboard, styles[mode])}>
      {keys.map((symbol) => {
        const isOperator = OPERATORS.includes(symbol.label)
        const isNumberKey = NUMBERS.includes(Number(symbol.title))
        const handleClick = () => onKeyPress(symbol)

        return (
          <button
            data-calc
            key={symbol.title}
            onClick={handleClick}
            className={clsx(styles.button, {
              [styles.operator]: isOperator,
              [styles.number]: isNumberKey,
              [styles.letterKey]: isLetters,
              [styles.mainKey]: isMain,
            })}
          >
            {symbol.icon ? <symbol.icon /> : symbol.title}
          </button>
        )
      })}
    </div>
  )
}
