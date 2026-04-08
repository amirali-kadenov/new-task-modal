import ArrowUpPressed from '@/assets/icons/calc/arrow-up-pressed.svg'
import ArrowUp from '@/assets/icons/calc/arrow-up.svg'

import { getLetterSymbols } from './lib'
import type { LetterSymbol } from './types'

// REGULAR LETTERS

const REGULAR_LETTERS_LIST = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
]

const REGULAR_LETTERS = getLetterSymbols(REGULAR_LETTERS_LIST)

// GREEK LETTERS

const GREEK_LETTERS_LIST = [
  'alpha',
  'beta',
  'gamma',
  'delta',
  'theta',
  'lambda',
  'sigma',
  'upsilon',
  'phi',
]

const GREEK_LETTERS_SYMBOLS: Record<string, string[]> = {
  alpha: ['α', 'Α'],
  beta: ['β', 'Β'],
  gamma: ['γ', 'Γ'],
  delta: ['δ', 'Δ'],
  theta: ['θ', 'Θ'],
  lambda: ['λ', 'Λ'],
  sigma: ['σ', 'Σ'],
  upsilon: ['υ', 'Υ'],
  phi: ['φ', 'Φ'],
}

const GREEK_LETTERS_WITHOUT_UPPERCASE_LATEX = new Set([
  'alpha',
  'beta',
  /* alfa and beta don't have spcific uppercase latex */
  'upsilon',
  /* upsilon is here, because latex \\Upsilon inserts special symbol ϒ, so instead we just render Y */
])

const GREEK_LETTERS = getLetterSymbols(GREEK_LETTERS_LIST, {
  prepare: (result, letter, capitalized) => {
    const [lowerSymbol, upperSymbol] = GREEK_LETTERS_SYMBOLS[letter]

    result.title = lowerSymbol
    result.latex = `\\${letter}`

    result.upperCased.title = upperSymbol
    result.upperCased.latex = `\\${capitalized}`

    if (GREEK_LETTERS_WITHOUT_UPPERCASE_LATEX.has(letter)) {
      result.upperCased.latex = upperSymbol
    }
  },
})

// ARROW UP

export const ARROW_UP_ACTION = 'arrow-up'

const ARROW_UP = {
  title: '↑',
  latex: '',
  label: 'ArrowUp',
  icon: ArrowUp,
  action: ARROW_UP_ACTION,
  upperCased: {
    icon: ArrowUpPressed,
  },
}

// LETTERS

export const LETTERS: LetterSymbol[] = [
  ARROW_UP,
  ...REGULAR_LETTERS,
  ...GREEK_LETTERS,
]
