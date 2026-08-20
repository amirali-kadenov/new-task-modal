import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react'

// `joinMathAnswers` wraps correct-answer values as `\(...\)` before they ever
// reach this hook (MathText, unlike MathFormula, doesn't wrap on its own).
// Slicing that string at the raw character level can land inside the
// delimiters (`\(114\` — no closing `\)`), producing invalid LaTeX that
// MathJax can't parse and falls back to showing literally. Multi-answer text
// joins several `\(...\)` islands with plain separators (e.g. `\(5\) ; \(7\)`
// from joinMathAnswers) — treating the whole string as one island lets a cut
// land inside the interior `\) ; \(` boundary and leaves a stray, unmatched
// `\)` rendered as literal text. Parse every island separately and truncate
// island-by-island so a cut never crosses a delimiter boundary.
const MATH_ISLAND = /\\\((.*?)\\\)/gs

// scrollWidth and clientWidth are each independently rounded to the nearest
// CSS pixel by the browser. On real devices with a fractional
// devicePixelRatio (2.625, 2.75, ...) that rounding alone can make a layout
// that truly fits read as 1-2px "overflowing", tripping the close-to-fitting
// one-character cut below on text that never needed truncation (observed in
// prod: "400" -> "40…"). Two flat pixels absorbs that rounding noise without
// masking genuine overflow, which is always at least a full glyph's worth of
// extra width.
const OVERFLOW_TOLERANCE_PX = 2

interface Segment {
  isMath: boolean
  content: string
}

const parseSegments = (text: string): Segment[] => {
  const segments: Segment[] = []
  let lastIndex = 0
  for (const match of text.matchAll(MATH_ISLAND)) {
    const index = match.index ?? 0
    if (index > lastIndex) {
      segments.push({ isMath: false, content: text.slice(lastIndex, index) })
    }
    segments.push({ isMath: true, content: match[1] })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    segments.push({ isMath: false, content: text.slice(lastIndex) })
  }
  return segments
}

const getSlicer = (
  text: string,
): { length: number; slice: (n: number) => string } => {
  const segments = parseSegments(text)
  const hasMath = segments.some((segment) => segment.isMath)
  if (!hasMath) {
    return { length: text.length, slice: (n) => text.slice(0, n) }
  }

  const length = segments.reduce(
    (sum, segment) => sum + segment.content.length,
    0,
  )

  const slice = (n: number): string => {
    let remaining = n
    let out = ''
    for (const segment of segments) {
      if (remaining <= 0) break
      const take = Math.min(remaining, segment.content.length)
      const piece = segment.content.slice(0, take)
      out += segment.isMath ? `\\(${piece}\\)` : piece
      remaining -= take
    }
    return out
  }

  return { length, slice }
}

export const useAnswerTruncation = (
  answerClassName: string,
  text: string,
): {
  rowRef: RefObject<HTMLDivElement | null>
  displayText: string
  truncated: boolean
  onTypesetDone: () => void
} => {
  const rowRef = useRef<HTMLDivElement>(null)
  const slicer = useMemo(() => getSlicer(text), [text])

  const [visibleLength, setVisibleLength] = useState(slicer.length)
  const visibleLengthRef = useRef(visibleLength)

  useLayoutEffect(() => {
    visibleLengthRef.current = visibleLength
  }, [visibleLength])

  useLayoutEffect(() => {
    setVisibleLength(slicer.length)
  }, [slicer])

  // Binary-search bounds for the cut/grow step below: the largest length
  // confirmed to fit, and the smallest confirmed to overflow. `null` means
  // "not yet known". MathJax's rendering of the answer isn't a linear
  // function of raw character count -- confirmed live: it collapses
  // whitespace between words in math mode, so a multi-word answer's raw
  // character count (spaces included) systematically overstates how much
  // visual width each character actually costs. A cut amount guessed from
  // the overflow ratio (assuming linearity) can therefore overshoot by a
  // lot for such text and permanently strand unused space in the row (the
  // old code never grew back except on an external row-resize or
  // fonts-ready signal). Binary search doesn't assume any relationship
  // between character count and width at all; it just tests candidates and
  // converges on the true maximum fitting length regardless of how
  // non-linear the real rendering turns out to be.
  const searchLowRef = useRef<number | null>(null)
  const searchHighRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    searchLowRef.current = null
    searchHighRef.current = null
  }, [slicer])

  // Guards against stacking overlapping double-rAF schedules: onInitTypeset
  // and onTypeset both fire this same callback on MathJax's first typeset
  // (two calls land in the same tick), and every cut we make re-typesets,
  // which re-fires this callback again once MathJax settles. Only one
  // "wait for a settled frame, then measure" pass may be in flight; a call
  // that arrives while one is pending is dropped, not queued.
  const measurementScheduledRef = useRef(false)
  const rafId1Ref = useRef(0)
  const rafId2Ref = useRef(0)

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafId1Ref.current)
      cancelAnimationFrame(rafId2Ref.current)
    }
  }, [])

  // Measurement is triggered by MathJax's own typeset-complete callback,
  // but MathJax reports "done" the instant it finishes its own DOM writes
  // -- before the browser has necessarily reflowed/painted them. Reading
  // scrollWidth/clientWidth synchronously here can catch layout mid-settle
  // (fallback-font metrics before a webfont swap lands, a sibling still
  // mid-reflow, MathJax's own multi-pass layout). Chain two rAFs: the
  // first can still fire before other pending layout work has settled,
  // but by the time the second one fires, at least one full frame -- with
  // its layout and paint -- has completed, so the measurement reads real,
  // settled geometry.
  //
  // Each step re-typesets, which re-fires this callback, so the binary
  // search above naturally converges over a handful of cycles. It only
  // searches within what it's already tried, though — if conditions change
  // externally (the row itself gets wider, fonts finish loading), that's
  // handled separately below by watching for those signals and re-opening
  // the search with a full-text offer.
  const onTypesetDone = useCallback(() => {
    if (measurementScheduledRef.current) return
    measurementScheduledRef.current = true

    const measure = () => {
      const row = rowRef.current
      if (!row) return

      const answer = row.querySelector<HTMLElement>(`.${answerClassName}`)
      if (!answer) return

      const { scrollWidth, clientWidth } = answer
      const current = visibleLengthRef.current
      const fits = scrollWidth <= clientWidth + OVERFLOW_TOLERANCE_PX

      if (fits) {
        searchLowRef.current = current
        if (current >= slicer.length) return // full text already fits

        const high = searchHighRef.current ?? slicer.length
        if (high - current <= 1) return // converged: nothing more fits

        const next = Math.floor((current + high) / 2)
        if (next <= current) return
        setVisibleLength(next)
      } else {
        searchHighRef.current = current
        if (current <= 1) return

        const low = searchLowRef.current ?? 0
        const next = Math.floor((low + current) / 2)
        setVisibleLength(next < current ? next : current - 1)
      }
    }

    rafId1Ref.current = requestAnimationFrame(() => {
      rafId2Ref.current = requestAnimationFrame(() => {
        measurementScheduledRef.current = false
        measure()
      })
    })
  }, [answerClassName, slicer.length])

  // Recovery for the one-directional cut above: if the row's available
  // width grows (font metrics settling, layout reflow, sidebar/calculator
  // toggling) after a truncating measurement, re-offer the full text so
  // onTypesetDone can re-measure and only re-cut if it's still genuinely
  // overflowing. Watches the row, not the answer node itself — the answer
  // node's own width changes every time we slice it, which would otherwise
  // make this fire on our own cuts instead of on real external resizes.
  const lastRowWidthRef = useRef<number | null>(null)

  useEffect(() => {
    const row = rowRef.current
    if (!row) return

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width === undefined) return

      const lastWidth = lastRowWidthRef.current
      lastRowWidthRef.current = width

      if (
        lastWidth !== null &&
        width > lastWidth &&
        visibleLengthRef.current < slicer.length
      ) {
        // The row is wider now, so a length that overflowed under the old
        // (narrower) width may fit under the new one -- that stale high
        // bound would otherwise cap the search below what's now achievable.
        searchHighRef.current = null
        setVisibleLength(slicer.length)
      }
    })

    observer.observe(row)
    return () => observer.disconnect()
  }, [slicer])

  // Additional, parallel recovery: fonts load async (font-display: swap,
  // see font-css.ts) so the first typeset/measurement can happen against
  // fallback-font metrics before the real webfont's glyph widths are known
  // — the same "measured before layout settled" risk that motivated
  // `hookFontsReady` in stretch-tall-glyphs.ts for glyph-stretch scale. If
  // the row's own width never changes after a premature cut (it's typically
  // constrained by the modal layout, not its own content), the
  // ResizeObserver above never fires, so this offers one more full-text
  // re-check specifically on the fonts-ready signal.
  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts?.ready) return

    let cancelled = false
    void document.fonts.ready.then(() => {
      if (cancelled) return
      if (visibleLengthRef.current < slicer.length) {
        // Same reasoning as the ResizeObserver recovery above: the fonts
        // settling can change per-character widths, so a stale overflow
        // bound from before could wrongly cap the post-settle search.
        searchHighRef.current = null
        setVisibleLength(slicer.length)
      }
    })

    return () => {
      cancelled = true
    }
  }, [slicer])

  const displayText =
    visibleLength >= slicer.length ? text : slicer.slice(visibleLength)

  return {
    rowRef,
    displayText,
    truncated: visibleLength < slicer.length,
    onTypesetDone,
  }
}
