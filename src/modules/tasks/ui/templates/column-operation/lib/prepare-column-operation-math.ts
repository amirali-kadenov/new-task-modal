/**
 * Sanitize / normalize columnOperation LaTeX before MathJax render.
 *
 * CMS payloads use nested empty superscripts for +/−/× (scriptscriptstyle —
 * too small) and often trail `\end{array}` with `\\`.
 *
 * CIS division «уголком» is rendered as HTML (`DivisionCorner`), not rewritten
 * here — see `parse-division-corner.ts`.
 */

/** Enlarge CMS operator glyphs while keeping left-shift via one `^`. */
const enlargeOperators = (tex: string): string =>
  tex
    .replaceAll('{}^{{}^{{}^{+}}}', '{}^{{\\textstyle +}}')
    .replaceAll('{}^{{}^{{}^{-}}}', '{}^{{\\textstyle -}}')
    .replaceAll('{}^{{}^{{}^{\\times}}}', '{}^{{\\textstyle \\times}}')

/** Drop `\\` (and blank lines) immediately after `\end{array}`. */
const stripTrailingArrayBreaks = (tex: string): string =>
  tex.replace(/(\\end\{array\})\s*(?:\\\\\s*)+/g, '$1\n')

export const prepareColumnOperationMath = (tex: string): string => {
  const trimmed = tex.trim()
  if (!trimmed) return trimmed

  return stripTrailingArrayBreaks(enlargeOperators(trimmed)).trim()
}
