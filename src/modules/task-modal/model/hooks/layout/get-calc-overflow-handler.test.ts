import { describe, expect, it, vi } from 'vitest'

import type { OpenState } from '../use-open-state'

import {
  handleCalcOverflow,
  hasTaskContainerOverflow,
} from './get-calc-overflow-handler'
import type { TaskModalRefs } from './use-refs'

describe('hasTaskContainerOverflow', () => {
  it('is true when scrollHeight exceeds clientHeight', () => {
    const el = {
      clientHeight: 100,
      scrollHeight: 250,
    } as HTMLDivElement
    expect(hasTaskContainerOverflow(el)).toBe(true)
  })

  it('is false when content fits', () => {
    const el = {
      clientHeight: 200,
      scrollHeight: 200,
    } as HTMLDivElement
    expect(hasTaskContainerOverflow(el)).toBe(false)
  })
})

describe('handleCalcOverflow', () => {
  const makeRefs = (taskContainer: HTMLDivElement): TaskModalRefs => ({
    taskContainer: { current: taskContainer },
    root: { current: null },
    header: { current: null },
    calc: { current: null },
    actions: { current: null },
    mathInput: { current: null },
  })

  const makeCalc = (): OpenState & { isOpen: boolean } => {
    const state = { isOpen: true }
    return {
      get isOpen() {
        return state.isOpen
      },
      open: vi.fn(() => {
        state.isOpen = true
      }),
      close: vi.fn(() => {
        state.isOpen = false
      }),
    }
  }

  it('attaches listeners before closing on overflow and reopens on control click', () => {
    const taskContainer = document.createElement('div')
    Object.defineProperty(taskContainer, 'clientHeight', { value: 100 })
    Object.defineProperty(taskContainer, 'scrollHeight', { value: 400 })

    const control = document.createElement('span')
    control.setAttribute('data-control', '')
    taskContainer.appendChild(control)
    document.body.appendChild(taskContainer)

    const calc = makeCalc()
    const cleanup = handleCalcOverflow({
      refs: makeRefs(taskContainer),
      calc,
    })

    expect(calc.close).toHaveBeenCalled()
    expect(calc.isOpen).toBe(false)

    control.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(calc.open).toHaveBeenCalled()

    cleanup()
    taskContainer.remove()
  })

  it('reopens calc on focusin of data-control when overflowing', () => {
    const taskContainer = document.createElement('div')
    Object.defineProperty(taskContainer, 'clientHeight', { value: 100 })
    Object.defineProperty(taskContainer, 'scrollHeight', { value: 400 })

    const control = document.createElement('span')
    control.setAttribute('data-control', '')
    control.tabIndex = 0
    taskContainer.appendChild(control)
    document.body.appendChild(taskContainer)

    const calc = makeCalc()
    const cleanup = handleCalcOverflow({
      refs: makeRefs(taskContainer),
      calc,
    })

    expect(calc.isOpen).toBe(false)

    control.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    expect(calc.open).toHaveBeenCalled()

    cleanup()
    taskContainer.remove()
  })
})
