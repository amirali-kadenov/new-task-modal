/**
 * DOM invariants for MathJax CHTML output (browser / Storybook Vitest).
 * Unit tests mock MathText — use these only where real MathJax runs.
 */

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const isSkippableTextParent = (node: Node | null): boolean => {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) return false
  const tag = (node as Element).tagName.toLowerCase()
  return tag === 'script' || tag === 'style' || tag === 'noscript'
}

/** Raw `\(` / `\)` left in visible text nodes under `root` (unfinished typeset). */
const findRawMathDelimiterHits = (root: ParentNode): string[] => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const hits: string[] = []

  let current = walker.nextNode()
  while (current) {
    if (!isSkippableTextParent(current.parentNode)) {
      const text = current.textContent ?? ''
      if (text.includes('\\(') || text.includes('\\)')) {
        hits.push(text.trim().slice(0, 60))
      }
    }
    current = walker.nextNode()
  }

  return hits
}

/**
 * Wait until MathJax has typeset everything under `root`: at least one
 * `mjx-container` exists AND no raw `\(`/`\)` remain in text nodes. Domains
 * that mount several `MathText` instances per message (e.g. `complex`
 * answer tables) fire independent, unbatched typeset calls — waiting for
 * only the first container to appear races ahead of the rest.
 */
export const waitForMathJax = async (
  root: ParentNode,
  timeoutMs = 8000,
): Promise<void> => {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (
      root.querySelector('mjx-container') &&
      findRawMathDelimiterHits(root).length === 0
    ) {
      return
    }
    await sleep(50)
  }
  throw new Error(
    `MathJax: typesetting incomplete within ${timeoutMs}ms (no mjx-container, or raw \\( \\) still present)`,
  )
}

/** Fail if MathJax reported a TeX error (red `mjx-merror`, often raw `\(`). */
export const assertNoMathJaxErrors = (root: ParentNode): void => {
  const errors = root.querySelectorAll('mjx-merror')
  if (errors.length === 0) return

  const samples = [...errors]
    .slice(0, 3)
    .map((el) => (el.textContent ?? '').trim() || el.outerHTML.slice(0, 80))
    .join(' | ')
  throw new Error(
    `MathJax: ${errors.length} mjx-merror node(s) — often double-wrapped \\(...\\). Samples: ${samples}`,
  )
}

/**
 * After typeset, visible text must not still contain raw `\(` / `\)`
 * (double-wrap leaves a trailing `\)` outside math).
 */
export const assertNoRawMathDelimiters = (root: ParentNode): void => {
  const hits = findRawMathDelimiterHits(root)
  if (hits.length === 0) return
  throw new Error(
    `MathJax: raw \\( or \\) left in text nodes (${hits.length}). Samples: ${hits.slice(0, 3).join(' | ')}`,
  )
}

/**
 * CMS uses `||` between equivalent accepted answers. It must be resolved before
 * MathJax, otherwise it appears as a norm/parallel glyph (`‖` / `∥`).
 */
export const assertNoAnswerSeparator = (root: ParentNode): void => {
  const text = root.textContent ?? ''
  const match = text.match(/\|\||‖|∥/)
  if (!match) return

  throw new Error(
    `MathJax: unresolved answer alternative separator "${match[0]}" in rendered text`,
  )
}

/** MathJax CHTML marks italic math identifiers with these classes. */
const isItalicMathNode = (el: Element): boolean => {
  const cls = el.className?.toString?.() ?? String(el.className ?? '')
  if (cls.includes('TEX-I') || /(^|\s)mjx-i(\s|$)/.test(cls)) return true
  // Walk up a few levels — glyph may be mjx-c inside mjx-mi.mjx-i
  let parent: Element | null = el.parentElement
  for (let i = 0; i < 3 && parent; i += 1) {
    const pCls =
      parent.className?.toString?.() ?? String(parent.className ?? '')
    if (pCls.includes('TEX-I') || /(^|\s)mjx-i(\s|$)/.test(pCls)) return true
    parent = parent.parentElement
  }
  return false
}

/**
 * Measurement units must be upright (`\\mathrm`), not italic identifiers.
 * Catches text_16-style splits where bare `д` stays italic next to `\mathrm{м}`.
 * Note: MathJax may still use `mjx-mi` for `\mathrm{дм}` — check italic classes,
 * not the tag alone.
 */
export const assertUprightUnit = (root: ParentNode, unit: string): void => {
  if (!unit) throw new Error('assertUprightUnit: empty unit')

  const containers = [...root.querySelectorAll('mjx-container')]
  const foundInMath = containers.some((c) =>
    (c.textContent ?? '').includes(unit),
  )
  if (!foundInMath) {
    throw new Error(
      `MathJax: unit "${unit}" not found inside any mjx-container`,
    )
  }

  for (const node of root.querySelectorAll('mjx-mi, mjx-c')) {
    const text = (node.textContent ?? '').trim()
    if (!text || !isItalicMathNode(node)) continue

    if (text === unit) {
      throw new Error(`MathJax: unit "${unit}" rendered italic (TEX-I / mjx-i)`)
    }

    // Classic split: first letter(s) italic, rest in \mathrm
    if (
      unit.length > 1 &&
      unit.startsWith(text) &&
      text.length < unit.length &&
      /[а-яёА-ЯЁ]/.test(text)
    ) {
      throw new Error(
        `MathJax: unit "${unit}" looks split — italic fragment "${text}" (missing from UNITS or lookaround?)`,
      )
    }
  }
}

const familyList = (value: string): string[] =>
  value
    .split(',')
    .map((family) => family.trim().replace(/^["']|["']$/g, ''))
    .filter((family) => family !== '' && family.toUpperCase() !== 'MJXZERO')

/**
 * Cyrillic has no TeX glyph, so MathJax draws it in `mjx-utext` using its own
 * `unknownFamily` (serif) instead of the family we set on the `mjx-mi` parent.
 * Units like `см` then clash with the surrounding prose (text_6).
 * Latin/digit glyphs (`mjx-c`) are the reference: they already follow the prose font.
 */
export const assertMathGlyphFontConsistent = (root: ParentNode): void => {
  const unknownGlyphs = [...root.querySelectorAll('mjx-utext')]
  const reference = root.querySelector('mjx-c')
  if (unknownGlyphs.length === 0 || !reference) return

  const expected = familyList(getComputedStyle(reference).fontFamily)[0]

  for (const node of unknownGlyphs) {
    const actual = familyList(getComputedStyle(node).fontFamily)[0]
    if (actual === expected) continue

    throw new Error(
      `MathJax: "${(node.textContent ?? '').trim()}" renders in "${actual ?? '<none>'}" ` +
        `but math glyphs use "${expected ?? '<none>'}" (mjx-utext fell back to unknownFamily)`,
    )
  }
}

const parsePx = (value: string): number => {
  const n = Number.parseFloat(value)
  return Number.isFinite(n) ? n : NaN
}

const isUnderScript = (el: Element): boolean => {
  let parent: Element | null = el.parentElement
  while (parent) {
    if (parent.tagName.toLowerCase() === 'mjx-script') return true
    parent = parent.parentElement
  }
  return false
}

/**
 * Numerator/denominator glyphs must match surrounding prose font-size.
 * `\frac` in inline math drops them to scriptstyle (~0.71); `\dfrac` keeps
 * them at prose size. Powers under `mjx-script` are skipped on purpose.
 */
export const assertMathSizeMatchesProse = (
  root: ParentNode,
  toleranceRatio = 0.08,
): void => {
  const containers = [...root.querySelectorAll('mjx-container')]
  for (const container of containers) {
    const proseEl = container.parentElement
    if (!proseEl) continue
    const prosePx = parsePx(getComputedStyle(proseEl).fontSize)
    if (!Number.isFinite(prosePx) || prosePx <= 0) continue

    const glyphs = container.querySelectorAll(
      'mjx-num mjx-c, mjx-num mjx-utext, mjx-den mjx-c, mjx-den mjx-utext',
    )
    for (const glyph of glyphs) {
      if (isUnderScript(glyph)) continue
      const glyphPx = parsePx(getComputedStyle(glyph).fontSize)
      if (!Number.isFinite(glyphPx)) continue

      const ratio = glyphPx / prosePx
      if (Math.abs(ratio - 1) <= toleranceRatio) continue

      throw new Error(
        `MathJax: fraction glyph "${(glyph.textContent ?? '').trim() || glyph.className}" ` +
          `is ${glyphPx}px vs prose ${prosePx}px (ratio ${ratio.toFixed(2)}). ` +
          `Likely textstyle \\frac — expect \\dfrac`,
      )
    }
  }
}

/** Run the cheap catalog-safe checks after typeset. */
export const assertMathJaxHealthy = (root: ParentNode): void => {
  assertNoMathJaxErrors(root)
}

/** Full regression bundle for known text.plain fixtures. */
export const assertMathJaxRegressionDom = async (
  root: ParentNode,
  options?: { uprightUnits?: string[] },
): Promise<void> => {
  await waitForMathJax(root)
  assertNoMathJaxErrors(root)
  assertNoRawMathDelimiters(root)
  assertNoAnswerSeparator(root)
  assertMathGlyphFontConsistent(root)
  assertMathSizeMatchesProse(root)
  for (const unit of options?.uprightUnits ?? []) {
    assertUprightUnit(root, unit)
  }
}
