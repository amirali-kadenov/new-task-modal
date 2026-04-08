import { useEffect, useRef } from 'react'

import type { Task } from '@/types/api/task'

import { getParentWithAttr } from '../../helpers'

import type { CalcState } from './use-calc-setup'
import type { TaskModalRefs } from './use-refs'

const FOCUSED = 'focused'
const DATA_INPUT = 'data-input'
const DATA_CALC = 'data-calc'

interface Args {
  refs: TaskModalRefs
  activeTask: Task
  calcState: CalcState
}

export const useInputFocus = ({ refs, activeTask, calcState }: Args) => {
  const lastFocusedInput = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = refs.root.current
    const taskContainer = refs.taskContainer.current

    if (!root || !taskContainer || !calcState.isSetupFinished) {
      return
    }

    const setFocusedInput = (input: HTMLElement) => {
      lastFocusedInput.current?.classList.remove(FOCUSED)
      lastFocusedInput.current = input

      input.classList.add(FOCUSED)
    }

    const setInitialFocus = () => {
      if (lastFocusedInput.current) return

      const input = refs.taskContainer.current?.querySelector(`[${DATA_INPUT}]`)

      if (input instanceof HTMLElement) {
        setFocusedInput(input)

        const map = refs.mathInput.current
        if (!map) return

        const mathInputRef = map.get(input.id)
        mathInputRef?.focus()
      }
    }

    const handler = (event: MouseEvent) => {
      const target = event.target

      const isElement = target instanceof HTMLElement
      if (!isElement) return

      const isInput = target.hasAttribute(DATA_INPUT)
      if (isInput) {
        setFocusedInput(target)
        return
      }

      const parentInput = getParentWithAttr(target, DATA_INPUT)
      if (parentInput) {
        setFocusedInput(parentInput)
        return
      }

      const isCalc = target.hasAttribute(DATA_CALC)
      const parentCalc = getParentWithAttr(target, DATA_CALC)
      const lastFcsdInp = lastFocusedInput.current

      if (isCalc || parentCalc) {
        lastFcsdInp?.classList.add(FOCUSED)
      } else {
        lastFcsdInp?.classList.remove(FOCUSED)
      }
    }

    setInitialFocus()

    root.addEventListener('click', handler)

    return () => {
      root.removeEventListener('click', handler)
      lastFocusedInput.current?.classList.remove(FOCUSED)
      lastFocusedInput.current = null
    }
  }, [activeTask.id, calcState.isSetupFinished])

  return lastFocusedInput
}
