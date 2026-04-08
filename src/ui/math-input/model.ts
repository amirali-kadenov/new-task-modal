import type { RefObject } from 'react'

import type { MathField } from './types'

/**
 * Mapping of calculator label symbols to their corresponding keystroke commands
 * Used for handling navigation and special keyboard inputs
 */
const KEYSTROKE_SYMBOLS: Record<string, string> = {
  backspace: 'Backspace',
  spacebar: 'Spacebar',
  enter: 'Enter',
  up: 'Up',
  down: 'Down',
  left: 'Left',
  right: 'Right',
}

/**
 * Handles keystroke commands like navigation and special keys
 * @param mathField - The MathQuill field instance
 * @param symbolLower - The lowercase symbol to check for keystroke mapping
 * @returns True if the symbol was handled as a keystroke, false otherwise
 */
const handleKeystroke = (
  mathField: MathField | null,
  symbol: string,
): boolean => {
  const symbolLower = symbol.toLowerCase()
  const keystroke = KEYSTROKE_SYMBOLS[symbolLower]

  if (keystroke) {
    mathField?.keystroke(keystroke)
    return true
  }
  return false
}

/**
 * Checks if the cursor is currently inside a fraction
 * @param mathField - The MathQuill field instance
 * @returns True if cursor is inside a fraction, false otherwise
 */
const isInsideFraction = (mathField: MathField | null): boolean => {
  if (!mathField) return false

  // Get the current LaTeX and cursor position
  const latex = mathField.latex()

  // Check if there's a \frac command in the expression
  if (!latex.includes('\\frac')) return false

  // Get the selection (cursor position info)
  // MathQuill doesn't expose direct cursor position, but we can check
  // if we're in a fraction by trying to move out of it
  try {
    // Try to get parent element - if we're in a fraction,
    // the internal structure will have fraction-specific classes

    const element = mathField.el()
    if (!element) return false

    // Check if any parent has the fraction class
    const cursor = element.querySelector('.mq-cursor')
    if (!cursor) return false

    let parent = cursor.parentElement
    while (parent && parent !== element) {
      if (parent.classList.contains('mq-fraction')) {
        return true
      }
      parent = parent.parentElement
    }

    return false
  } catch {
    // If we can't determine, allow the fraction to be safe
    return false
  }
}

/**
 * Handles special mathematical symbols and LaTeX commands
 * Includes fractions, operators, exponents, and other mathematical notation
 * @param mathField - The MathQuill field instance
 * @param symbol - The symbol to insert
 * @returns True if the symbol was handled, false otherwise
 */
const handleSpecialSymbol = (
  mathField: MathField | null,
  symbol: string,
): boolean => {
  const symbolHandlers: Record<string, () => void> = {
    '\\frac': () => {
      // Prevent nested fractions
      if (isInsideFraction(mathField)) {
        return
      }
      mathField?.cmd('\\frac')
    },
    '≠': () => {
      mathField?.cmd('\\neq')
    },
    '÷': () => {
      mathField?.cmd('\\div')
    },
    '×': () => {
      mathField?.cmd('\\cdot')
    },
    '( )': () => {
      mathField?.write('(')
      mathField?.write(')')
      mathField?.keystroke('Left')
    },
    '_^': () => {
      mathField?.write('_{}^{}')
      mathField?.keystroke('Left')
      mathField?.keystroke('Left')
    },
    '\\log': () => {
      mathField?.write('log_{}')
      mathField?.keystroke('Left')
    },
    Delete: () => {
      mathField?.keystroke('Backspace')
    },
  }

  const handler = symbolHandlers[symbol]
  if (handler) {
    handler()
    return true
  }

  // Handle simple symbols
  if (['(', ')', '[', ']', '|'].includes(symbol)) {
    mathField?.write(symbol)
    return true
  }

  if (symbol === '^{\\circ}') {
    mathField?.write(symbol)
    return true
  }

  // Handle LaTeX commands
  if (symbol.startsWith('\\')) {
    mathField?.cmd(symbol)
    return true
  }

  return false
}

/**
 * Inserts a symbol into the math field at the current cursor position
 * Handles keystrokes, special symbols, LaTeX commands, and regular text
 * @param mathField - The MathQuill field instance
 * @param symbol - The symbol to insert
 */
export const insertSymbolToMathField = (
  mathField: MathField | null,
  symbol: string,
): void => {
  // mathField?.focus()

  // Try keystroke handling first
  if (handleKeystroke(mathField, symbol)) {
    return
  }

  // Try special symbol handling
  if (handleSpecialSymbol(mathField, symbol)) {
    return
  }

  // Default: write as regular text
  mathField?.write(symbol)
}

// ============================================================================
// MathQuill Configuration
// ============================================================================

/**
 * Default configuration options for MathQuill
 * Controls behavior for spacing, brackets, operators, and auto-commands
 */
export const MATHQUILL_CONFIG = {
  spaceBehavesLikeTab: true,
  restrictMismatchedBrackets: true,
  supSubsRequireOperand: true,
  autoCommands: 'theta sqrt sum frac',
  readOnly: true,
}

/**
 * Creates event handlers for MathQuill field
 * @param mathFieldInstance - Reference to the MathQuill field instance
 * @param lastSetFormula - Reference tracking the last formula set programmatically
 * @param onMathFieldChanged - Optional callback for formula changes
 * @returns Handler object with edit callback
 */
export const createMathQuillHandlers = (
  mathFieldInstance: RefObject<MathField>,
  lastSetFormula: RefObject<string>,
  onMathFieldChanged?: (latex: string) => void,
) => ({
  edit() {
    const latex = mathFieldInstance.current.latex()
    if (onMathFieldChanged && lastSetFormula.current !== latex) {
      onMathFieldChanged(latex)
    }
  },
})
