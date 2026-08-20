import '@testing-library/jest-dom/vitest'

/** jsdom gaps used by SolutionAnswerPanel multiline detection. */
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = ResizeObserverStub
}

if (
  typeof Range !== 'undefined' &&
  typeof Range.prototype.getClientRects === 'undefined'
) {
  Range.prototype.getClientRects = function getClientRects() {
    return [] as unknown as DOMRectList
  }
}
