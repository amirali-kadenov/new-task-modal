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
// that truly fits read as 1-2px "overflowing", tripping a needless cut on
// text that never needed truncation (observed in prod: "400" -> "40…"). Two
// flat pixels absorbs that rounding noise without masking genuine overflow,
// which is always at least a full glyph's worth of extra width.
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

// A cut landing right after a bare `\letters` run with nothing closing it
// yet (no `{`, space, or other non-letter following) hands MathJax an
// incomplete control sequence -- e.g. slicing `\frac{2}{3}` down to `\fra`
// -- which it renders as a red parse error instead of a clean truncation.
// Drop the whole dangling command rather than risk that: same
// undershoot-for-safety trade-off as the ratio estimate below. Only ever
// applied to a piece that was actually cut, never to a segment included in
// full, so a command that legitimately ends the untruncated text (`...\pi`)
// is never touched.
const trimIncompleteCommand = (value: string): string =>
  value.replace(/\\[a-zA-Z]*$/, '')

const getSlicer = (
  text: string,
): { length: number; slice: (n: number) => string } => {
  const segments = parseSegments(text)
  const hasMath = segments.some((segment) => segment.isMath)
  if (!hasMath) {
    return {
      length: text.length,
      slice: (n) => trimIncompleteCommand(text.slice(0, n)),
    }
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
      let piece = segment.content.slice(0, take)
      if (take < segment.content.length) {
        piece = trimIncompleteCommand(piece)
      }
      out += segment.isMath ? `\\(${piece}\\)` : piece
      remaining -= take
    }
    return out
  }

  return { length, slice }
}

// The answer element's own CSS (`overflow: hidden; white-space: nowrap` on
// `answerClassName`, set by the caller) is the real safety net: it alone
// guarantees nothing ever visually spills out of the row, from the very
// first paint, regardless of anything below. `text-overflow: ellipsis` is
// deliberately NOT part of that contract -- MathJax renders the answer as a
// nested `mjx-container`, not a text node, and CSS ellipsis can't insert a
// "…" inside an opaque nested block like that; it just silently fails to
// show one. The "…" is always the explicit `truncated`-gated sibling the
// caller renders, never a CSS effect.
//
// What this hook adds on top of that CSS clip is an exact,
// MATH_ISLAND-safe character cut, computed with a single ratio-based
// estimate -- deliberately not an iterative search. MathJax's rendering
// isn't strictly linear in character count (it collapses whitespace
// between words in math mode), so the estimate undershoots by one
// character as a safety margin rather than assuming the ratio is exact. If
// that single cut still doesn't fit -- rare, only for pathological
// non-linear text -- the re-typeset it causes naturally re-triggers this
// same measurement once more; each step strictly shortens the text, so it
// always terminates.
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

  const [displayLength, setDisplayLength] = useState(slicer.length)
  const displayLengthRef = useRef(displayLength)

  useLayoutEffect(() => {
    displayLengthRef.current = displayLength
  }, [displayLength])

  // Whenever the text itself changes, start over from the full length --
  // the CSS safety net keeps this visually correct even before the first
  // measurement below runs.
  useLayoutEffect(() => {
    setDisplayLength(slicer.length)
  }, [slicer])

  // Guards against stacking overlapping double-rAF schedules: onInitTypeset
  // and onTypeset both fire this same callback on MathJax's first typeset
  // (two calls land in the same tick), and a cut we make re-typesets,
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

  // Single measurement, single cut -- no search loop. If the current
  // length already fits, there's nothing to do. If it overflows, the ratio
  // of available-to-needed width estimates how many characters to drop;
  // `- 1` is the non-linearity safety margin, and capping at `current - 1`
  // guarantees the length strictly decreases even if the ratio rounds to
  // no change, so repeated calls (see below) can't get stuck.
  const measure = useCallback(() => {
    const row = rowRef.current
    if (!row) return

    const answer = row.querySelector<HTMLElement>(`.${answerClassName}`)
    if (!answer) return

    const { scrollWidth, clientWidth } = answer
    if (scrollWidth <= clientWidth + OVERFLOW_TOLERANCE_PX) return // fits, nothing to do

    const current = displayLengthRef.current
    if (current <= 1) return // already at the floor

    const ratio = clientWidth / scrollWidth
    const estimate = Math.min(current - 1, Math.floor(current * ratio) - 1)
    setDisplayLength(Math.max(1, estimate))
  }, [answerClassName])

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
  // Cutting re-typesets, which re-fires this callback, so `measure` above
  // runs again naturally on its own if one cut wasn't enough.
  const onTypesetDone = useCallback(() => {
    if (measurementScheduledRef.current) return
    measurementScheduledRef.current = true

    rafId1Ref.current = requestAnimationFrame(() => {
      rafId2Ref.current = requestAnimationFrame(() => {
        measurementScheduledRef.current = false
        measure()
      })
    })
  }, [measure])

  // Re-evaluate on a one-off signal (fonts ready -- fires at most once,
  // never in a loop): try the full text again if currently truncated
  // (triggers a real re-render -> re-typeset -> `measure()` above cuts
  // again if it's still genuinely overflowing), or, if already showing the
  // full text, measure directly (`setDisplayLength(slicer.length)` would
  // be a same-value no-op there -- React bails, nothing re-renders,
  // nothing ever re-measures against the new metrics).
  const reevaluateOnce = useCallback(() => {
    if (displayLengthRef.current >= slicer.length) {
      measure()
    } else {
      setDisplayLength(slicer.length)
    }
  }, [slicer, measure])

  // Row width changing — font metrics settling, layout reflow, sidebar/
  // calculator toggling, viewport resize. Watches the row, not the answer
  // node itself — the answer node's own width changes every time we cut
  // it, and in some layouts the row's own width tracks its content too, so
  // our own cuts can and do feed back into this observer.
  //
  // That feedback is exactly why grow and shrink must be handled by
  // strictly different, non-symmetric actions, not "re-evaluate either
  // way" (that shape caused a real infinite loop: shrink-while-truncated
  // would optimistically reset to full text -> content gets longer -> row
  // grows -> grow handler reads "still fits? no, cut" -> row shrinks again
  // -> shrink handler resets to full again -> forever, whenever the row's
  // width happens to be coupled to its own content).
  //
  // Shrink only ever calls `measure()`, which can only ever cut *further*
  // (never grow) -- so a shrink can never be the thing that re-triggers a
  // grow. Grow only ever offers the full text, and only when currently
  // truncated (a no-op otherwise) -- so once it's tried that at a given
  // width, repeating the same width again does nothing further. Neither
  // direction can re-arm the other, so the loop can't sustain itself.
  const lastRowWidthRef = useRef<number | null>(null)

  useEffect(() => {
    const row = rowRef.current
    if (!row) return

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width === undefined) return

      const lastWidth = lastRowWidthRef.current
      lastRowWidthRef.current = width
      if (lastWidth === null) return // baseline observation only
      if (Math.abs(width - lastWidth) <= OVERFLOW_TOLERANCE_PX) return

      if (width > lastWidth) {
        if (displayLengthRef.current < slicer.length) {
          setDisplayLength(slicer.length)
        }
      } else {
        measure()
      }
    })

    observer.observe(row)
    return () => observer.disconnect()
  }, [slicer, measure])

  // Additional, parallel recovery: fonts load async (font-display: swap,
  // see font-css.ts) so the first typeset/measurement can happen against
  // fallback-font metrics before the real webfont's glyph widths are known.
  // If the row's own width never changes after a premature cut (it's
  // typically constrained by the modal layout, not its own content), the
  // ResizeObserver above never fires, so this re-evaluates once more
  // specifically on the fonts-ready signal. Safe as a one-shot "try full,
  // else measure" — unlike the ResizeObserver, this only ever runs once
  // per mount, so it can't feed back into itself.
  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts?.ready) return

    let cancelled = false
    void document.fonts.ready.then(() => {
      if (cancelled) return
      reevaluateOnce()
    })

    return () => {
      cancelled = true
    }
  }, [reevaluateOnce])

  const displayText =
    displayLength >= slicer.length ? text : slicer.slice(displayLength)

  return {
    rowRef,
    displayText,
    truncated: displayLength < slicer.length,
    onTypesetDone,
  }
}
