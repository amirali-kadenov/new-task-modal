/**
 * Parse CIS school «уголок» from CMS LaTeX:
 * `\left. {L}\right\vert{\underline{D}}` or `\left. {L}\right\vert{\Large{\frac{D}{Q}}}`.
 * Returns display strings with `\phantom{…}` stripped. Arabic `\overline` is not handled.
 */

/** Index of `}` matching `{` at `openIdx`, or -1. */
const matchingBrace = (source: string, openIdx: number): number => {
  if (source[openIdx] !== '{') return -1
  let depth = 0
  for (let i = openIdx; i < source.length; i += 1) {
    const ch = source[i]
    if (ch === '{') depth += 1
    else if (ch === '}') {
      depth -= 1
      if (depth === 0) return i
    }
  }
  return -1
}

const skipSpace = (source: string, from: number): number => {
  let i = from
  while (
    source[i] === ' ' ||
    source[i] === '\n' ||
    source[i] === '\t' ||
    source[i] === '\r'
  ) {
    i += 1
  }
  return i
}

/** Drop `\phantom{…}` (and empty braces left behind). */
export const stripPhantoms = (tex: string): string =>
  tex
    .replace(/\\phantom\{[^{}]*\}/g, '')
    .replace(/\{\s*\}/g, '')
    .trim()

/** `\underline{D}` → divisor, or null. */
const parseUnderline = (right: string): string | null => {
  const trimmed = right.trim()
  if (!trimmed.startsWith('\\underline{')) return null
  const open = '\\underline{'.length - 1
  const close = matchingBrace(trimmed, open)
  if (close < 0 || close !== trimmed.length - 1) return null
  return trimmed.slice(open + 1, close).trim()
}

/** `\Large{\frac{D}{Q}}` → { divisor, quotient }, or null. */
const parseLargeFrac = (
  right: string,
): { divisor: string; quotient: string } | null => {
  const trimmed = right.trim()
  if (!trimmed.startsWith('\\Large{')) return null
  const largeOpen = '\\Large{'.length - 1
  const largeClose = matchingBrace(trimmed, largeOpen)
  if (largeClose < 0 || largeClose !== trimmed.length - 1) return null

  const inner = trimmed.slice(largeOpen + 1, largeClose).trim()
  if (!inner.startsWith('\\frac{')) return null
  const dOpen = '\\frac{'.length - 1
  const dClose = matchingBrace(inner, dOpen)
  if (dClose < 0) return null
  const i = skipSpace(inner, dClose + 1)
  if (inner[i] !== '{') return null
  const qClose = matchingBrace(inner, i)
  if (qClose < 0 || skipSpace(inner, qClose + 1) !== inner.length) return null

  return {
    divisor: inner.slice(dOpen + 1, dClose).trim(),
    quotient: inner.slice(i + 1, qClose).trim(),
  }
}

const CORNER_START = '\\left.'
const VERT = '\\right\\vert'

/**
 * Whether `tex` contains the «уголок» shape at all, regardless of whether
 * the quotient slot is parseable (e.g. a phantom-only placeholder in the
 * question-form CMS text). Use this to decide "is this a division corner"
 * without requiring a successful full parse.
 */
export const isDivisionCornerTex = (tex: string): boolean =>
  tex.includes(CORNER_START) && tex.includes(VERT)

export type DivisionCornerParts = {
  dividend: string
  divisor: string
  quotient?: string
}

export type ParseDivisionCornerOptions = {
  /** Solution view: show this under the hline even when CMS has question form. */
  quotient?: string
}

/**
 * First CIS corner in `tex`, or null if none / unparseable right-hand side.
 */
export const parseDivisionCorner = (
  tex: string,
  options?: ParseDivisionCornerOptions,
): DivisionCornerParts | null => {
  const source = tex.trim()
  if (!source) return null

  const start = source.indexOf(CORNER_START)
  if (start < 0) return null

  let i = skipSpace(source, start + CORNER_START.length)
  if (source[i] !== '{') return null

  const leftClose = matchingBrace(source, i)
  if (leftClose < 0) return null
  const left = source.slice(i + 1, leftClose)

  i = skipSpace(source, leftClose + 1)
  if (!source.startsWith(VERT, i)) return null
  i = skipSpace(source, i + VERT.length)
  if (source[i] !== '{') return null

  const rightClose = matchingBrace(source, i)
  if (rightClose < 0) return null
  const right = source.slice(i + 1, rightClose)

  const injected = options?.quotient?.trim() || undefined
  const dividend = stripPhantoms(left)
  if (!dividend) return null

  const underlined = parseUnderline(right)
  if (underlined !== null) {
    const divisor = stripPhantoms(underlined)
    if (!divisor) return null
    return {
      dividend,
      divisor,
      ...(injected ? { quotient: stripPhantoms(injected) } : {}),
    }
  }

  const frac = parseLargeFrac(right)
  if (frac) {
    const divisor = stripPhantoms(frac.divisor)
    const quotient = stripPhantoms(injected ?? frac.quotient)
    if (!divisor || !quotient) return null
    return { dividend, divisor, quotient }
  }

  return null
}
