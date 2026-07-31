/** Longest-first measurement units rendered upright via `\mathrm`. */
const UNITS = [
  'км/ч',
  'мин',
  'сек',
  'мм',
  'см',
  'дм',
  'км',
  'кг',
  'мг',
  'мл',
  'м',
  'г',
  'т',
  'л',
  'ч',
] as const

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const UNIT_ALT = UNITS.map(escapeRegExp).join('|')

/**
 * Inside a math island: wrap known units in `\mathrm`, convert `unit^n` →
 * `\mathrm{unit}^{n}`. Leaves TeX commands and latin variables alone.
 * Cyrillic lookbehind/ahead keep units from matching inside longer words
 * (e.g. `мл` must not eat the start of `млн`).
 */
export const uprightUnitsInTex = (tex: string): string => {
  if (!tex) return tex

  const re = new RegExp(
    String.raw`\\mathrm\{[^}]*\}|\\[a-zA-Z]+(?:\{[^}]*\})*|\\%|(?<![а-яёА-ЯЁ])(${UNIT_ALT})(?![а-яёА-ЯЁ])(\^[0-9]+)?`,
    'g',
  )

  return tex.replace(
    re,
    (match, unit: string | undefined, caret: string | undefined) => {
      if (unit == null) return match
      const power = caret ? `^{${caret.slice(1)}}` : ''
      return `\\mathrm{${unit}}${power}`
    },
  )
}

/**
 * Apply `uprightUnitsInTex` to every `\(...\)` island in mixed prose/math text.
 */
export const uprightMathUnits = (text: string): string =>
  text.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, inner: string) => `\\(${uprightUnitsInTex(inner)}\\)`,
  )
