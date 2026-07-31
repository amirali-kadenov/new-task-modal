/**
 * Strips outer `\(...\)` from an API answer string so it can be re-wrapped
 * by `MathFormula` (which always adds its own delimiters). Real CMS answers
 * come already delimited (`"\\(8000\\)"`); double wrapping breaks MathJax.
 */
export const stripMathDelimiters = (value: string): string => {
  const trimmed = value.trim()
  const match = trimmed.match(/^\\\(([\s\S]*)\\\)$/)
  return match ? match[1].trim() : trimmed
}

/** True when the whole string is a single `\(...\)` island (outer wrap only). */
export const hasOuterMathDelimiters = (value: string): boolean =>
  /^\\\(([\s\S]*)\\\)$/.test(value.trim())

/**
 * `MathFormula` always wraps children in `\(...\)`. Passing an already-wrapped
 * string yields `\(\(...\)\)` → MathJax `mjx-merror` (red `\(`).
 */
export const assertBareLatex = (value: string, label = 'latex'): string => {
  if (hasOuterMathDelimiters(value)) {
    throw new Error(
      `${label} must not include outer \\(...\\) — MathFormula wraps them`,
    )
  }
  return value
}
