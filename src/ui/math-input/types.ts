import type { ComponentPropsWithoutRef } from 'react'

declare global {
  interface Window {
    MathQuill: {
      getInterface(version: number): MathQuill
    }
  }
}

/**
 * MathQuill interface for creating math field instances
 */
interface MathQuill {
  MathField(element: HTMLElement, config: unknown): MathField
}

/**
 * MathQuill math field instance interface
 * Provides methods to manipulate and interact with a mathematical input field
 */
export interface MathField {
  /** Gets or sets the LaTeX content of the field */
  latex(latex?: string): string
  /** Writes content at the current cursor position */
  write(latex: string): void
  /** Executes a LaTeX command */
  cmd(latex: string): void
  /** Simulates a keyboard keystroke */
  keystroke(key: string): void
  /** Moves cursor to the leftmost position */
  moveToLeftEnd(): void
  /** Moves cursor to the end in a specified direction */
  moveToDirEnd(direction: number): void
  /** Focuses the math field */
  focus(): void
  /** Returns the root element of the math field */
  el(): HTMLElement | undefined
}

/**
 * Ref interface for imperative access to MathInput component methods
 */
export interface MathInputRef {
  id: string
  /** Inserts a symbol or command at the current cursor position */
  insertSymbol: (symbol: string) => void
  /** Sets the entire LaTeX content of the field */
  setLatex: (latex: string) => void
  /** Gets the current LaTeX content of the field */
  getLatex: () => string
  /** Writes LaTeX content at the current cursor position */
  writeOnCursorPosition: (latex: string) => void
  /** Focuses the math input field */
  focus: () => void
}

/**
 * Props for the MathInput component
 */
export interface MathInputProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'className'> {
  /** The LaTeX formula to display */
  formula: string
  /** Callback fired when the math field content changes */
  onMathFieldChanged?: (latex: string) => void
  /** Additional CSS class names */
  className?: string
}
