import clsx from 'clsx'
import { useEffect, useId, useImperativeHandle, useRef, type Ref } from 'react'

import { InputAsSpan } from '../input/input'
import { toMathQuillTex } from '../math-symbol-catalog'

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
  id: idProp,
  ...restProps
}: Props) => {
  const reactId = useId()
  /** Prefer explicit `id` so host/map lookup matches the DOM node (`data-input`). */
  const id = idProp ?? reactId

  const elementRef = useRef<HTMLSpanElement>(null)
  const instanceRef = useRef<MathField | null>(null)
  const lastSetFormulaRef = useRef(formula)
  /** Blocks edit→onChange while we apply latex programmatically (MathQuill fires edit sync). */
  const isSettingLatexRef = useRef(false)
  const onMathFieldChangedRef = useRef(onMathFieldChanged)
  useEffect(() => {
    onMathFieldChangedRef.current = onMathFieldChanged
  })

  const notifyChanged = (latex: string) => {
    if (isSettingLatexRef.current) return
    if (lastSetFormulaRef.current === latex) return
    lastSetFormulaRef.current = latex
    onMathFieldChangedRef.current?.(latex)
  }

  const setLatexProgrammatically = (latex: string) => {
    // MathQuill has no \dfrac command (MathJax-only) — feeding it raw CMS
    // LaTeX containing \dfrac silently breaks parsing.
    const mathQuillLatex = toMathQuillTex(latex)
    lastSetFormulaRef.current = mathQuillLatex
    if (!instanceRef.current) return
    if (instanceRef.current.latex() === mathQuillLatex) return
    isSettingLatexRef.current = true
    try {
      instanceRef.current.latex(mathQuillLatex)
    } finally {
      isSettingLatexRef.current = false
    }
  }

  // Expose imperative methods
  useImperativeHandle(ref, () => ({
    id,
    insertSymbol: (symbol: string) => {
      insertSymbolToMathField(instanceRef.current, symbol)
      notifyChanged(instanceRef.current?.latex() || '')
    },
    setLatex: (latex: string) => {
      setLatexProgrammatically(latex)
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
     * Initialize MathQuill on mount. Retry briefly if the host script or
     * element ref is not ready yet (common when the calculator opens first).
     * Clear instanceRef on unmount so remounts re-init on a fresh DOM node.
     */
    let cancelled = false
    let attempts = 0
    let retryId = 0
    const MAX_ATTEMPTS = 40

    const syncScrollToCaret = () => {
      requestAnimationFrame(() => {
        const el = elementRef.current
        const cursor = el?.querySelector<HTMLElement>('.mq-cursor')
        if (!el || !cursor) return
        // getBoundingClientRect, not offsetLeft: offsetLeft is relative to
        // the nearest positioned ancestor (offsetParent), which varies by
        // host layout (e.g. a dialog wrapper) and silently breaks this math.
        // Viewport rects are unambiguous regardless of ancestor positioning.
        const TRAILING_GAP = 12
        const elRect = el.getBoundingClientRect()
        const cursorRect = cursor.getBoundingClientRect()
        if (cursorRect.right > elRect.right - TRAILING_GAP) {
          el.scrollLeft += cursorRect.right - (elRect.right - TRAILING_GAP)
        } else if (cursorRect.left < elRect.left) {
          el.scrollLeft += cursorRect.left - elRect.left
        }
      })
    }

    // Arrow keys move the caret inside the field but shouldn't also reach
    // global keydown listeners (e.g. task-navigation arrows).
    const stopArrowPropagation = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.stopPropagation()
      }
    }

    const init = () => {
      if (cancelled || instanceRef.current) return

      if (!elementRef.current || !window.MathQuill) {
        if (attempts++ < MAX_ATTEMPTS) {
          retryId = window.setTimeout(init, 50)
        }
        return
      }

      const MQ = window.MathQuill.getInterface(2)
      const handlers = {
        edit: () => {
          if (!instanceRef.current) return
          notifyChanged(instanceRef.current.latex())
          syncScrollToCaret()
        },
      }

      instanceRef.current = MQ.MathField(elementRef.current, {
        ...MATHQUILL_CONFIG,
        handlers,
      })

      // `edit` only fires on content changes; arrow keys / Home / End move the
      // caret without editing, so keep the scroll position in sync on any
      // keyup too (calculator-button inserts go through `edit` above).
      elementRef.current.addEventListener('keyup', syncScrollToCaret)
      elementRef.current.addEventListener('keydown', stopArrowPropagation)

      setLatexProgrammatically(lastSetFormulaRef.current)
    }

    init()

    return () => {
      elementRef.current?.removeEventListener('keyup', syncScrollToCaret)
      elementRef.current?.removeEventListener('keydown', stopArrowPropagation)
      cancelled = true
      window.clearTimeout(retryId)
      instanceRef.current = null
    }
  }, [id])

  // Until MathQuill is ready, keep the seed in sync with the formula prop.
  // After init, ignore formula updates (legacy MathQuillField behavior).
  useEffect(() => {
    if (!instanceRef.current) {
      lastSetFormulaRef.current = formula
    }
  }, [formula])

  /**
   * Intentionally no formula→latex sync after mount.
   * Legacy MathQuillField only applied `formula` on init; re-applying on every
   * parent answer update races multi-input join/split and mirrors keystrokes
   * into sibling fields. External resets use imperative `setLatex` / remount.
   */

  return (
    <InputAsSpan
      {...restProps}
      id={id}
      data-input
      data-control
      ref={elementRef}
      className={clsx(styles.mathInput, className)}
    />
  )
}
