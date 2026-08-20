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

  it('converges on the true maximum fitting length via binary search, not a one-shot proportional guess', () => {
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

    let steps = 0
    let lastLength = -1
    while (steps < 20) {
      const currentLength = result.current.displayText.length
      mockWidths(answer, widthFor(currentLength), 100)

      act(() => {
        result.current.onTypesetDone()
        settle()
      })

      steps += 1
      if (result.current.displayText.length === lastLength) break
      lastLength = result.current.displayText.length
    }

    expect(result.current.displayText.length).toBe(20)
    expect(steps).toBeLessThan(10) // binary search over 61 items: ~6 steps

    row.remove()
  })
})
