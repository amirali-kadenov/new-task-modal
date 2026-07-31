import { afterEach, describe, expect, it } from 'vitest'

import { MATHQUILL_CONFIG, shouldSuppressNativeKeyboard } from './model'

describe('shouldSuppressNativeKeyboard', () => {
  const originalGlobal = (window as Window & { Global?: unknown }).Global

  afterEach(() => {
    ;(window as Window & { Global?: unknown }).Global = originalGlobal
  })

  it('uses window.Global.isTouchDeviceOrMobileBrowser when present', () => {
    ;(window as Window & { Global?: unknown }).Global = {
      isTouchDeviceOrMobileBrowser: () => true,
    }
    expect(shouldSuppressNativeKeyboard()).toBe(true)

    ;(window as Window & { Global?: unknown }).Global = {
      isTouchDeviceOrMobileBrowser: () => false,
    }
    expect(shouldSuppressNativeKeyboard()).toBe(false)
  })
})

describe('MATHQUILL_CONFIG.substituteTextarea', () => {
  const originalGlobal = (window as Window & { Global?: unknown }).Global

  afterEach(() => {
    ;(window as Window & { Global?: unknown }).Global = originalGlobal
  })

  it('returns a focusable span on touch/mobile', () => {
    ;(window as Window & { Global?: unknown }).Global = {
      isTouchDeviceOrMobileBrowser: () => true,
    }
    const el = MATHQUILL_CONFIG.substituteTextarea()
    expect(el.tagName).toBe('SPAN')
    expect(el.tabIndex).toBe(0)
  })

  it('returns a textarea on desktop', () => {
    ;(window as Window & { Global?: unknown }).Global = {
      isTouchDeviceOrMobileBrowser: () => false,
    }
    const el = MATHQUILL_CONFIG.substituteTextarea()
    expect(el.tagName).toBe('TEXTAREA')
  })
})
