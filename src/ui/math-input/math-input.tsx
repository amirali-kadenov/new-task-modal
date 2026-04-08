import clsx from 'clsx'
import { useEffect, useId, useImperativeHandle, useRef, type Ref } from 'react'

import { InputAsSpan } from '../input/input'

import styles from './math-input.module.scss'
import { insertSymbolToMathField, MATHQUILL_CONFIG } from './model'
import type { MathField, MathInputProps, MathInputRef } from './types'

interface Props extends MathInputProps {
  ref?: Ref<MathInputRef | null>
}

/**
 * MathInput component for rendering and editing mathematical formulas
 */
export const MathInput = ({
  ref,
  formula,
  onMathFieldChanged,
  className,
  ...restProps
}: Props) => {
  const id = useId()

  const elementRef = useRef<HTMLSpanElement>(null)
  const instanceRef = useRef<MathField | null>(null)
  const lastSetFormulaRef = useRef(formula)

  // Expose imperative methods
  useImperativeHandle(ref, () => ({
    id,
    insertSymbol: (symbol: string) => {
      insertSymbolToMathField(instanceRef.current, symbol)
    },
    setLatex: (latex: string) => {
      instanceRef.current?.latex(latex)
    },
    getLatex: () => {
      return instanceRef.current?.latex() || ''
    },
    writeOnCursorPosition: (latex: string) => {
      instanceRef.current?.write(latex)
    },
    focus: () => {
      instanceRef.current?.focus()
    },
  }))

  useEffect(() => {
    /**
     * Initialize MathQuill when the component mounts
     * Sets up the math field with configuration and event handlers
     */

    if (instanceRef.current) {
      return /* already initialized */
    }

    if (!elementRef.current || !window.MathQuill) {
      return
    }

    const MQ = window.MathQuill.getInterface(2)
    const handlers = {
      edit: () => {
        if (!instanceRef.current) return

        const latex = instanceRef.current.latex()

        if (lastSetFormulaRef.current !== latex) {
          onMathFieldChanged?.(latex)
        }
      },
    }

    instanceRef.current = MQ.MathField(elementRef.current, {
      ...MATHQUILL_CONFIG,
      handlers,
    })

    instanceRef.current.latex(formula)
    lastSetFormulaRef.current = formula
  }, [onMathFieldChanged, formula])

  useEffect(() => {
    /**
     * Sync external formula changes to the math field
     * Updates the field content when the formula prop changes
     */
    const shouldSync = formula !== lastSetFormulaRef.current
    if (!shouldSync || !instanceRef.current) return

    const currentLatex = instanceRef.current.latex()
    if (currentLatex !== formula) {
      instanceRef.current.latex(formula)
    }
    lastSetFormulaRef.current = formula
  }, [formula])

  return (
    <InputAsSpan
      id={id}
      data-input
      data-control
      ref={elementRef}
      className={clsx(styles.mathInput, className)}
      {...restProps}
    />
  )
}
