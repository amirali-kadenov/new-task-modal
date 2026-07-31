import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ChatLayout } from './chat-layout'

describe('ChatLayout autoscroll', () => {
  const scrollToSpy = vi.fn()
  const scrollIntoViewSpy = vi.fn()
  let originalScrollIntoView: typeof Element.prototype.scrollIntoView

  beforeEach(() => {
    scrollToSpy.mockClear()
    scrollIntoViewSpy.mockClear()
    originalScrollIntoView = Element.prototype.scrollIntoView

    // jsdom lacks Element.scrollTo — define before use.
    Object.defineProperty(Element.prototype, 'scrollTo', {
      configurable: true,
      writable: true,
      value: function (this: Element, ...args: unknown[]) {
        scrollToSpy(this, ...args)
      },
    })
    Element.prototype.scrollIntoView = function (
      this: Element,
      ...args: unknown[]
    ) {
      scrollIntoViewSpy(this, ...args)
    }
  })

  afterEach(() => {
    Reflect.deleteProperty(Element.prototype, 'scrollTo')
    Element.prototype.scrollIntoView = originalScrollIntoView
  })

  it('scrolls the messages list via scrollTo, not scrollIntoView', () => {
    const { rerender } = render(
      <ChatLayout messageNodes={[<span key="a">a</span>]} messageKeys={[1]}>
        <div>footer</div>
      </ChatLayout>,
    )

    expect(scrollToSpy).toHaveBeenCalled()
    const [target, opts] = scrollToSpy.mock.calls.at(-1)!
    expect((target as HTMLElement).tagName).toBe('UL')
    expect(opts).toMatchObject({ behavior: 'smooth' })
    expect(scrollIntoViewSpy).not.toHaveBeenCalled()

    scrollToSpy.mockClear()

    rerender(
      <ChatLayout
        messageNodes={[<span key="a">a</span>, <span key="b">b</span>]}
        messageKeys={[1, 2]}
      >
        <div>footer</div>
      </ChatLayout>,
    )

    expect(scrollToSpy).toHaveBeenCalled()
    expect(scrollIntoViewSpy).not.toHaveBeenCalled()
  })
})
