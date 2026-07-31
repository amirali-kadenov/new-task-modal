/**
 * Expand CMS `\frac` to `\dfrac` inside `\(...\)` islands so numerator and
 * denominator stay at prose font size (displaystyle) instead of scriptstyle.
 *
 * Idempotent: `\dfrac` does not contain the `\frac` substring, so a second
 * pass is a no-op.
 */
export const normalizeFractionStyle = (text: string): string => {
  if (!text.includes('\\frac')) return text

  return text.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, inner: string) => `\\(${inner.replace(/\\frac/g, '\\dfrac')}\\)`,
  )
}
