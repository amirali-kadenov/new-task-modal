import { capitalize } from '@/lib/helpers/capitalize'

import type { LetterSymbol } from './types'

interface Settings {
  prepare: (result: LetterSymbol, letter: string, capitalized: string) => void
}

export const getLetterSymbols = (letters: string[], settings?: Settings) => {
  return letters.map((letter) => {
    const capitalized = capitalize(letter)

    const result: LetterSymbol = {
      title: letter,
      label: letter,
      upperCased: {
        title: capitalized,
        label: capitalized,
      },
    }

    if (settings?.prepare) {
      settings.prepare(result, letter, capitalized)
    }

    return result
  })
}
