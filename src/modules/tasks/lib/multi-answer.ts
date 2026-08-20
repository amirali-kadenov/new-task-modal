/**
 * Multi-input answers use `;;` on the wire (API / fixtures), but a field may
 * itself contain `;` (e.g. mid-edit `3;` or value `3;8`). Naïve join/split is
 * not round-trip safe:
 *   ['3;', '', '', ''].join(';;') === '3;;;;;;;'
 *   '3;;;;;;;'.split(';;') === ['3', '', '', ';']  // clobbers latex → React loop
 *
 * While editing we store fields joined with a separator that cannot appear in
 * MathQuill latex; convert to `;;` only when talking to the API.
 */

const WIRE_SEPARATOR = ';;'
/** ASCII Record Separator — never produced by MathQuill latex(). */
const STORE_SEPARATOR = '\u001e'

export const joinMultiAnswer = (
  values: string[],
  separator: string,
): string => {
  if (separator !== WIRE_SEPARATOR) {
    return values.join(separator)
  }
  return values.join(STORE_SEPARATOR)
}

export const splitMultiAnswer = (
  answer: string,
  separator: string,
): string[] => {
  if (!answer) return ['']
  if (separator !== WIRE_SEPARATOR) {
    return answer.split(separator)
  }
  if (answer.includes(STORE_SEPARATOR)) {
    return answer.split(STORE_SEPARATOR)
  }
  return answer.split(WIRE_SEPARATOR)
}

/** Convert in-memory multi-answer to the `;;` form expected by the API. */
export const toWireMultiAnswer = (
  answer: string,
  separator: string,
): string => {
  if (separator !== WIRE_SEPARATOR) return answer
  if (!answer.includes(STORE_SEPARATOR)) return answer
  return answer.split(STORE_SEPARATOR).join(WIRE_SEPARATOR)
}
