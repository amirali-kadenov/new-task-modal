import { uprightUnitsInTex } from './upright-math-units'

/**
 * Wraps bare caret expressions (e.g. `см^2`, `mm^2`, `^2`) in `\(...\)`
 * outside existing MathJax delimiters. Units are upright via `\mathrm`.
 * No-op when there is no `^`.
 */
export const normalizeBareMath = (text: string): string => {
  if (!text.includes('^')) return text

  const parts = text.split(/(\\\([\s\S]*?\\\)|\$[^$]*\$)/)

  return parts
    .map((part) => {
      if (part.startsWith('\\(') || part.startsWith('$')) return part
      return part.replace(
        /([^\s\\]*\^[0-9]+)/g,
        (match) => `\\(${uprightUnitsInTex(match)}\\)`,
      )
    })
    .join('')
}

export const maybeNormalizeBareMath = (
  text: string,
  enabled: boolean,
): string => (enabled ? normalizeBareMath(text) : text)
