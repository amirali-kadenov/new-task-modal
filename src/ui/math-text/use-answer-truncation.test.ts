import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAnswerTruncation } from './use-answer-truncation'

const ANSWER_CLASS = 'answer'

const setupRow = (text: string) => {
  const row = document.createElement('div')
  const answer = document.createElement('span')
  answer.className = ANSWER_CLASS
  answer.textContent = text
  row.appendChild(answer)
  document.body.appendChild(row)
  return { row, answer }
}

const mockWidths = (
  el: HTMLElement,
  scrollWidth: number,
  clientWidth: number,
) => {
  Object.defineProperty(el, 'scrollWidth', {
    value: scrollWidth,
    configurable: true,
  })
  Object.defineProperty(el, 'clientWidth', {
    value: clientWidth,
    configurable: true,
  })
}

class FakeResizeObserver {
  static instances: FakeResizeObserver[] = []
  callback: ResizeObserverCallback
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    FakeResizeObserver.instances.push(this)
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  trigger(width: number) {
    this.callback([{ contentRect: { width } } as ResizeObserverEntry], this)
  }
}

/**
 * jsdom doesn't implement requestAnimationFrame at all, and onTypesetDone
 * now defers its measurement across two animation frames (see
 * use-answer-truncation.ts) to avoid reading mid-settle layout. Mirrors
 * FakeResizeObserver above: a manually-flushable queue instead of real
 * timers, so tests can advance exactly one frame at a time deterministically.
 */
class FakeRaf {
  requestCount = 0
  private queue = new Map<number, FrameRequestCallback>()
  private nextId = 1

  request = (callback: FrameRequestCallback): number => {
    this.requestCount += 1
    const id = this.nextId++
    this.queue.set(id, callback)
    return id
  }

  cancel = (id: number): void => {
    this.queue.delete(id)
  }

  /** Runs exactly the callbacks queued as of this call -- one "frame". */
  flushFrame(): void {
    const callbacks = [...this.queue.values()]
    this.queue.clear()
    for (const callback of callbacks) callback(0)
  }
}

let fakeRaf: FakeRaf

beforeEach(() => {
  fakeRaf = new FakeRaf()
  vi.stubGlobal('requestAnimationFrame', fakeRaf.request)
  vi.stubGlobal('cancelAnimationFrame', fakeRaf.cancel)
})

/** onTypesetDone defers past two frames before it measures; see use-answer-truncation.ts. */
const settle = () => {
  fakeRaf.flushFrame()
  fakeRaf.flushFrame()
}

const mockFontsReady = () => {
  let resolveReady: () => void = () => {}
  const ready = new Promise<FontFaceSet>((resolve) => {
    resolveReady = () => resolve({} as FontFaceSet)
  })
  Object.defineProperty(document, 'fonts', {
    value: { ready },
    configurable: true,
  })
  return { ready, resolveReady }
}

afterEach(() => {
  vi.unstubAllGlobals()
  FakeResizeObserver.instances = []
  delete (document as unknown as { fonts?: unknown }).fonts
})

describe('useAnswerTruncation', () => {
  it('does not truncate when content fits (scrollWidth <= clientWidth + 1)', () => {
    const text = 'hello world'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => useAnswerTruncation(ANSWER_CLASS, text))
    result.current.rowRef.current = row
    mockWidths(answer, 101, 100)

    act(() => {
      result.current.onTypesetDone()
      settle()
    })

    expect(result.current.truncated).toBe(false)
    expect(result.current.displayText).toBe(text)

    row.remove()
  })

  it('truncates when content overflows (scrollWidth > clientWidth + 1)', () => {
    const text = 'a very long answer that overflows the row'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => useAnswerTruncation(ANSWER_CLASS, text))
    result.current.rowRef.current = row
    mockWidths(answer, 200, 100)

    act(() => {
      result.current.onTypesetDone()
      settle()
    })

    expect(result.current.truncated).toBe(true)
    expect(result.current.displayText.length).toBeLessThan(text.length)

    row.remove()
  })

  it('resets to full text when the text prop changes', () => {
    const text1 = 'short'
    const { row, answer } = setupRow(text1)
    const { result, rerender } = renderHook(
      ({ text }) => useAnswerTruncation(ANSWER_CLASS, text),
      { initialProps: { text: text1 } },
    )
    result.current.rowRef.current = row
    mockWidths(answer, 200, 100)

    act(() => {
      result.current.onTypesetDone()
      settle()
    })
    expect(result.current.truncated).toBe(true)

    const text2 = 'a completely different, longer answer text'
    rerender({ text: text2 })

    expect(result.current.truncated).toBe(false)
    expect(result.current.displayText).toBe(text2)

    row.remove()
  })

  it('recovers truncated text when the row grows wide enough to fit', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver)

    const text = 'a very long answer that overflows the row'
    const { row, answer } = setupRow(text)
    // Assign rowRef during render (not after) so it's already set by the
    // time the mount effect below runs and constructs the ResizeObserver.
    const { result } = renderHook(() => {
      const hook = useAnswerTruncation(ANSWER_CLASS, text)
      hook.rowRef.current = row
      return hook
    })
    mockWidths(answer, 200, 100)

    act(() => {
      result.current.onTypesetDone()
      settle()
    })
    expect(result.current.truncated).toBe(true)

    const observer = FakeResizeObserver.instances.at(-1)
    expect(observer).toBeDefined()

    act(() => {
      observer?.trigger(100) // baseline observation, no growth yet
    })
    expect(result.current.truncated).toBe(true)

    act(() => {
      observer?.trigger(400) // row grew wider than before -> offer full text again
    })
    expect(result.current.truncated).toBe(false)
    expect(result.current.displayText).toBe(text)

    row.remove()
  })

  it('does not truncate when overflow is within subpixel/DPR rounding tolerance (scrollWidth <= clientWidth + 2)', () => {
    const text = '400'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => useAnswerTruncation(ANSWER_CLASS, text))
    result.current.rowRef.current = row
    mockWidths(answer, 102, 100)

    act(() => {
      result.current.onTypesetDone()
      settle()
    })

    expect(result.current.truncated).toBe(false)
    expect(result.current.displayText).toBe(text)

    row.remove()
  })

  it('still truncates when overflow exceeds the rounding tolerance (scrollWidth > clientWidth + 2)', () => {
    const text = '400'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => useAnswerTruncation(ANSWER_CLASS, text))
    result.current.rowRef.current = row
    mockWidths(answer, 103, 100)

    act(() => {
      result.current.onTypesetDone()
      settle()
    })

    expect(result.current.truncated).toBe(true)

    row.remove()
  })

  it('re-offers full text once document.fonts.ready resolves, even if the row width never changes', async () => {
    const { ready, resolveReady } = mockFontsReady()

    const text = 'a very long answer that overflows the row'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => useAnswerTruncation(ANSWER_CLASS, text))
    result.current.rowRef.current = row
    mockWidths(answer, 200, 100)

    act(() => {
      result.current.onTypesetDone()
      settle()
    })
    expect(result.current.truncated).toBe(true)

    await act(async () => {
      resolveReady()
      await ready
    })

    expect(result.current.truncated).toBe(false)
    expect(result.current.displayText).toBe(text)

    row.remove()
  })

  it('does not measure until two animation frames have elapsed', () => {
    const text = 'a very long answer that overflows the row'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => useAnswerTruncation(ANSWER_CLASS, text))
    result.current.rowRef.current = row
    mockWidths(answer, 200, 100)

    act(() => {
      result.current.onTypesetDone()
    })
    expect(result.current.truncated).toBe(false) // nothing measured yet

    act(() => {
      fakeRaf.flushFrame() // first frame: still mid-settle by design
    })
    expect(result.current.truncated).toBe(false)

    act(() => {
      fakeRaf.flushFrame() // second frame: now settled, measurement runs
    })
    expect(result.current.truncated).toBe(true)

    row.remove()
  })

  it('coalesces onTypesetDone calls within the same settle window into one scheduled measurement', () => {
    const text = 'a very long answer that overflows the row'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => useAnswerTruncation(ANSWER_CLASS, text))
    result.current.rowRef.current = row
    mockWidths(answer, 200, 100)

    act(() => {
      // Mirrors onInitTypeset + onTypeset firing the same callback together
      // on MathJax's first typeset.
      result.current.onTypesetDone()
      result.current.onTypesetDone()
    })

    expect(fakeRaf.requestCount).toBe(1)

    act(() => {
      settle()
    })
    expect(result.current.truncated).toBe(true)

    row.remove()
  })

  it('does not throw if the component unmounts while a measurement is pending', () => {
    const text = 'a very long answer that overflows the row'
    const { row, answer } = setupRow(text)
    const { result, unmount } = renderHook(() =>
      useAnswerTruncation(ANSWER_CLASS, text),
    )
    result.current.rowRef.current = row
    mockWidths(answer, 200, 100)

    act(() => {
      result.current.onTypesetDone()
      fakeRaf.flushFrame() // first frame only -- second (the measurement) is still pending
    })

    expect(() => unmount()).not.toThrow()
    expect(() => act(() => fakeRaf.flushFrame())).not.toThrow()

    row.remove()
  })

  it('cuts once via a ratio estimate, undershooting slightly rather than searching for the exact boundary', () => {
    // Simulates non-linear width-per-character, like MathJax collapsing
    // whitespace in math mode: the first 30 characters cost 5px each, the
    // 31st (a "space") costs nothing, the rest cost 5px each again. With
    // clientWidth 100 (+2px tolerance), the true fitting boundary is 20
    // characters (100px) -- 21 would be 105px, over tolerance.
    const widthFor = (n: number) => {
      const real = Math.min(n, 30) + Math.max(0, n - 31)
      return real * 5
    }

    const text = 'A'.repeat(30) + ' ' + 'B'.repeat(30) // 61 chars
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => useAnswerTruncation(ANSWER_CLASS, text))
    result.current.rowRef.current = row

    mockWidths(answer, widthFor(text.length), 100)
    act(() => {
      result.current.onTypesetDone()
      settle()
    })

    // A single cut lands just under the true boundary (20) -- deliberately
    // conservative, never a multi-step search, and nowhere near collapsing
    // toward zero the way the old buggy behavior did in production.
    expect(result.current.truncated).toBe(true)
    expect(result.current.displayText.length).toBe(19)

    // Re-measuring against the now-shorter text confirms it's stable: it
    // already fits, so a second cycle cuts nothing further.
    mockWidths(answer, widthFor(result.current.displayText.length), 100)
    act(() => {
      result.current.onTypesetDone()
      settle()
    })
    expect(result.current.displayText.length).toBe(19)

    row.remove()
  })

  it('does nothing when the row grows while already showing the full text', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver)

    const text = 'short answer'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => {
      const hook = useAnswerTruncation(ANSWER_CLASS, text)
      hook.rowRef.current = row
      return hook
    })
    mockWidths(answer, 50, 100) // fits comfortably from the start

    act(() => {
      result.current.onTypesetDone()
      settle()
    })
    expect(result.current.truncated).toBe(false)

    const observer = FakeResizeObserver.instances.at(-1)
    act(() => {
      observer?.trigger(100) // baseline
    })
    act(() => {
      observer?.trigger(400) // grows further -- still fits, nothing to do
    })

    expect(result.current.truncated).toBe(false)
    expect(result.current.displayText).toBe(text)

    row.remove()
  })

  it('re-truncates already-fitting text when the row shrinks narrower', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver)

    const text = 'a modest answer'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => {
      const hook = useAnswerTruncation(ANSWER_CLASS, text)
      hook.rowRef.current = row
      return hook
    })
    mockWidths(answer, 100, 100) // fits exactly at the initial (wide) row

    act(() => {
      result.current.onTypesetDone()
      settle()
    })
    expect(result.current.truncated).toBe(false)
    expect(result.current.displayText).toBe(text)

    const observer = FakeResizeObserver.instances.at(-1)
    expect(observer).toBeDefined()

    act(() => {
      observer?.trigger(100) // baseline observation, no shrink yet
    })
    expect(result.current.truncated).toBe(false)

    // Row got narrower (e.g. a calculator panel opened) -- same rendered
    // content (scrollWidth unchanged), but less room to show it in.
    mockWidths(answer, 100, 40)

    act(() => {
      observer?.trigger(40) // row shrank -> measured directly, no re-typeset needed
    })

    expect(result.current.truncated).toBe(true)
    expect(result.current.displayText).toBe('a mod')

    row.remove()
  })

  it('cuts further (never resets to full) when an already-truncated row shrinks even more', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver)

    const text = 'a very long answer that overflows the row'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => {
      const hook = useAnswerTruncation(ANSWER_CLASS, text)
      hook.rowRef.current = row
      return hook
    })
    mockWidths(answer, 200, 100)

    act(() => {
      result.current.onTypesetDone()
      settle()
    })
    expect(result.current.truncated).toBe(true)
    const firstCut = result.current.displayText

    const observer = FakeResizeObserver.instances.at(-1)
    act(() => {
      observer?.trigger(100) // baseline
    })

    // Row shrinks further -- the already-truncated content still doesn't
    // fit the even-narrower row.
    mockWidths(answer, 200, 40)
    act(() => {
      observer?.trigger(40)
    })

    // Must cut further, never reset back to the full (untruncated) text --
    // resetting to full on a shrink was the actual cause of a real
    // infinite loop in production: shrink -> reset to full -> content gets
    // longer -> row grows (whenever its width tracks its own content) ->
    // grow handler measures, finds it overflows, cuts -> row shrinks again
    // -> shrink handler resets to full again -> forever.
    expect(result.current.truncated).toBe(true)
    expect(result.current.displayText).not.toBe(text)
    expect(result.current.displayText.length).toBeLessThan(firstCut.length)

    row.remove()
  })

  it('does not re-measure on resize noise within the rounding tolerance', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver)

    const text = 'a very long answer that overflows the row'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => {
      const hook = useAnswerTruncation(ANSWER_CLASS, text)
      hook.rowRef.current = row
      return hook
    })
    mockWidths(answer, 200, 100)

    act(() => {
      result.current.onTypesetDone()
      settle()
    })
    expect(result.current.truncated).toBe(true)
    const displayTextAfterCut = result.current.displayText

    const observer = FakeResizeObserver.instances.at(-1)
    act(() => {
      observer?.trigger(100) // baseline
    })

    // If this were actually (re-)measured it would read as fully fitting --
    // proves the epsilon guard below, not some other reason, is what keeps
    // it from firing.
    mockWidths(answer, 50, 100)

    act(() => {
      observer?.trigger(101) // 1px change -- within OVERFLOW_TOLERANCE_PX
    })

    expect(result.current.truncated).toBe(true)
    expect(result.current.displayText).toBe(displayTextAfterCut)

    row.remove()
  })

  it('keeps \\(...\\) delimiters balanced when truncating a single math-wrapped answer', () => {
    const text = '\\(123456789\\)' // content: "123456789" (9 chars)
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => useAnswerTruncation(ANSWER_CLASS, text))
    result.current.rowRef.current = row
    mockWidths(answer, 200, 100) // overflow -> ratio 0.5 -> single-shot cut to content-length 3

    act(() => {
      result.current.onTypesetDone()
      settle()
    })

    expect(result.current.truncated).toBe(true)
    expect(result.current.displayText).toBe('\\(123\\)')

    row.remove()
  })

  it('cuts inside a math island without stranding an unmatched delimiter', () => {
    // content-only length: "12" (2) + " ; " (3) + "34" (2) = 7 -- the raw
    // string (with delimiters) is 15 chars, so this only lands on the
    // right cut point if the cut operates on content length, not raw
    // string length.
    const text = '\\(12\\) ; \\(34\\)'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => useAnswerTruncation(ANSWER_CLASS, text))
    result.current.rowRef.current = row
    mockWidths(answer, 200, 100) // overflow -> ratio 0.5 -> single-shot cut to content-length 2

    act(() => {
      result.current.onTypesetDone()
      settle()
    })

    expect(result.current.truncated).toBe(true)
    // The cut lands exactly at the end of the first island's content --
    // still a fully-formed, balanced `\(12\)`, never a dangling `\(`.
    expect(result.current.displayText).toBe('\\(12\\)')
    const opens = result.current.displayText.match(/\\\(/g) ?? []
    const closes = result.current.displayText.match(/\\\)/g) ?? []
    expect(opens.length).toBe(closes.length)

    row.remove()
  })

  it('never strands a dangling control sequence when a cut lands mid-command (plain text)', () => {
    // Cutting "124zmaayd\frac{2}{3}" at content-length 12 would land right
    // after "\fra" -- an incomplete control sequence MathJax renders as a
    // red parse error (mjx-merror) instead of quietly truncating.
    const text = '124zmaayd\\frac{2}{3}'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => useAnswerTruncation(ANSWER_CLASS, text))
    result.current.rowRef.current = row
    // length 20, ratio 0.7 -> estimate lands at 13, right after "\fra".
    mockWidths(answer, 100, 70)

    act(() => {
      result.current.onTypesetDone()
      settle()
    })

    expect(result.current.truncated).toBe(true)
    expect(result.current.displayText).toBe('124zmaayd')
    expect(result.current.displayText.endsWith('\\')).toBe(false)
    expect(/\\[a-zA-Z]*$/.test(result.current.displayText)).toBe(false)

    row.remove()
  })

  it('never strands a dangling control sequence when a cut lands mid-command (inside a math island)', () => {
    const text = '\\(124zmaayd\\frac{2}{3}\\)'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => useAnswerTruncation(ANSWER_CLASS, text))
    result.current.rowRef.current = row
    // content length 20, same 0.7 ratio -> estimate lands at content-length 13.
    mockWidths(answer, 100, 70)

    act(() => {
      result.current.onTypesetDone()
      settle()
    })

    expect(result.current.truncated).toBe(true)
    expect(result.current.displayText).toBe('\\(124zmaayd\\)')

    row.remove()
  })

  it('does not touch a command that legitimately ends the untruncated text', () => {
    const text = 'x = \\pi'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => useAnswerTruncation(ANSWER_CLASS, text))
    result.current.rowRef.current = row
    mockWidths(answer, 50, 100) // fits -- never cut

    act(() => {
      result.current.onTypesetDone()
      settle()
    })

    expect(result.current.truncated).toBe(false)
    expect(result.current.displayText).toBe(text)

    row.remove()
  })

  it('does not truncate math-wrapped text that already fits, by content length not raw string length', () => {
    // Raw string is 15 chars including delimiters; content is only 7 -- if
    // the search used raw length instead of content length, a clientWidth
    // sized for content would read as overflowing here.
    const text = '\\(12\\) ; \\(34\\)'
    const { row, answer } = setupRow(text)
    const { result } = renderHook(() => useAnswerTruncation(ANSWER_CLASS, text))
    result.current.rowRef.current = row
    mockWidths(answer, 7, 100) // fits comfortably at content-length scale

    act(() => {
      result.current.onTypesetDone()
      settle()
    })

    expect(result.current.truncated).toBe(false)
    expect(result.current.displayText).toBe(text)

    row.remove()
  })
})
