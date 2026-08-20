/** Empty / spacer math islands (`\(\ \)`, `\(\)`, `\( \)`) — ME legacy artifact. */
const EMPTY_MATH_ISLAND_RE = /\\\(\s*(?:\\\s)*\s*\\\)/g

/** MathJax breaks typesetting on empty math islands; drop them before rendering. */
export const stripEmptyMathIslands = (text: string): string =>
  text.replace(EMPTY_MATH_ISLAND_RE, '')
