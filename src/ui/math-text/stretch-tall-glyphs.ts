import styles from './math-text.module.scss'

/**
 * Halvar glyphs are taller than the TeX metrics MathJax sized the radicals and
 * `\left...\right` delimiters with, so the content sticks out of them. Rescale
 * those glyphs after typesetting to match what is actually rendered.
 */

/** classic overhang: the hook goes slightly below the radicand */
const OVERHANG_PX = 1.5
const MIN_SCALE = 1.01
/** MathJax switches to these fonts for glyphs it grows: TEX-S1..TEX-S4 */
const SIZE_VARIANT = /\bTEX-S\d\b/

let scheduled = false
let fontsHooked = false

const markStretched = (element: HTMLElement, stretched: boolean) => {
  if (stretched) element.dataset.stretched = 'true'
  else delete element.dataset.stretched
}

/** A scaled glyph paints outside its layout box, so include it explicitly. */
const visualBounds = (element: Element) => {
  const rect = element.getBoundingClientRect()
  let top = rect.top
  let bottom = rect.bottom

  for (const stretched of element.querySelectorAll('[data-stretched]')) {
    const inner = stretched.getBoundingClientRect()
    top = Math.min(top, inner.top)
    bottom = Math.max(bottom, inner.bottom)
  }

  return { top, bottom, height: bottom - top }
}

const stretchRadicals = () => {
  const roots = document.querySelectorAll<HTMLElement>(
    `.${styles.mathText} mjx-sqrt`,
  )

  for (const root of roots) {
    const surd = root.querySelector<HTMLElement>(':scope > mjx-surd')
    const content = root.querySelector<HTMLElement>(':scope > mjx-box')
    if (!surd || !content) continue

    surd.style.transform = ''
    markStretched(surd, false)
    const surdHeight = surd.getBoundingClientRect().height
    if (!surdHeight) continue

    const scale = (visualBounds(content).height + OVERHANG_PX) / surdHeight
    if (scale <= MIN_SCALE) continue

    surd.style.transformOrigin = 'top'
    surd.style.transform = `scaleY(${scale})`
    markStretched(surd, true)
  }
}

const isGrownDelimiter = (element: Element) =>
  element.tagName === 'MJX-MO' &&
  (element.querySelector('mjx-stretchy-v') !== null ||
    SIZE_VARIANT.test(element.querySelector('mjx-c')?.className ?? ''))

const depthOf = (element: Element) => {
  let depth = 0
  let node = element.parentElement
  while (node) {
    depth += 1
    node = node.parentElement
  }
  return depth
}

const stretchDelimiters = () => {
  const delimiters = [
    ...document.querySelectorAll<HTMLElement>(`.${styles.mathText} mjx-mo`),
  ].filter(isGrownDelimiter)

  // innermost first, so nested delimiters are measured after they grew
  delimiters.sort((a, b) => depthOf(b) - depthOf(a))

  for (const delimiter of delimiters) {
    const row = delimiter.parentElement
    if (!row) continue

    delimiter.style.transform = ''
    markStretched(delimiter, false)
    const box = delimiter.getBoundingClientRect()
    if (!box.height) continue

    let top = Infinity
    let bottom = -Infinity
    for (const sibling of row.children) {
      if (sibling === delimiter || isGrownDelimiter(sibling)) continue

      const bounds = visualBounds(sibling)
      if (!bounds.height) continue

      top = Math.min(top, bounds.top)
      bottom = Math.max(bottom, bounds.bottom)
    }
    if (top === Infinity) continue

    const scale = (bottom - top) / box.height
    if (scale <= MIN_SCALE) continue

    const shift = (top + bottom) / 2 - (box.top + box.bottom) / 2
    delimiter.style.transformOrigin = 'center'
    delimiter.style.transform = `translateY(${shift}px) scaleY(${scale})`
    markStretched(delimiter, true)
  }
}

const hookFontsReady = () => {
  if (fontsHooked || typeof document === 'undefined') return
  fontsHooked = true

  if (!document.fonts?.ready) return
  void document.fonts.ready.then(() => {
    scheduleMathStretch()
  })
}

/** Coalesce multiple typeset callbacks into one paint-frame pass. */
export const scheduleMathStretch = () => {
  if (typeof document === 'undefined') return

  hookFontsReady()

  if (scheduled) return
  scheduled = true

  requestAnimationFrame(() => {
    scheduled = false
    stretchRadicals()
    stretchDelimiters()
  })
}
