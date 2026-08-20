import clsx from 'clsx'
import { useEffect } from 'react'
import type { RefObject } from 'react'

import type { CalcState } from '@/modules/task-modal/model/hooks/layout/use-calc-setup'
import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import type { TaskModalModals } from '@/modules/task-modal/task-modal'

import type { TaskModalRefs } from '../../../model/hooks/layout/use-refs'
import type { TaskModalProps } from '../../../model/types/props'

import { TaskModalActions } from './actions/actions'
import { TaskModalActionsSkeleton } from './actions/actions-skeleton'
import { Calculator } from './calculator/calculator'
import { CalculatorSkeleton } from './calculator/calculator-skeleton'
import s from './controls.module.scss'

interface Props {
  refs: TaskModalRefs
  props: TaskModalProps
  calcState: CalcState
  lastFocusedInput: RefObject<HTMLElement | null>
  modals: TaskModalModals
  isAdjusting: boolean
}

export const TaskModalControls = ({
  refs,
  props,
  calcState,
  lastFocusedInput: lastFocusedInputRef,
  modals,
  isAdjusting,
}: Props) => {
  const { calc } = refs
  const { isEnabled, isOpen } = calcState

  const setIsTaskLoaded = useStore((s) => s.setIsTaskLoaded)

  const handleInput = (symbol: string) => {
    const map = refs.mathInput.current
    if (!map || map.size === 0) return

    const focusedId = lastFocusedInputRef.current?.id ?? ''
    const focused = focusedId ? map.get(focusedId) : undefined
    // Fallback when auto-focus missed the field (lazy template / late MathQuill).
    const input = focused ?? map.values().next().value
    if (!input) return

    if (!focused) {
      const container = refs.taskContainer.current
      const byId = input.id ? document.getElementById(input.id) : null
      const domInput =
        byId instanceof HTMLElement &&
        byId.hasAttribute('data-input') &&
        container?.contains(byId)
          ? byId
          : (container?.querySelector<HTMLElement>('[data-input]') ?? null)
      if (domInput) {
        lastFocusedInputRef.current?.classList.remove('focused')
        lastFocusedInputRef.current = domInput
        domInput.classList.add('focused')
      }
    }

    input.insertSymbol(symbol)
  }

  useEffect(() => {
    window.setLoadingFalse = () => setIsTaskLoaded(false)
    window.setLoadingTrue = () => setIsTaskLoaded(true)
  }, [setIsTaskLoaded])

  // if (!isTaskLoaded) {
  //   return (
  //     <>
  //       <TaskModalActionsSkeleton ref={actions} />
  //       <CalculatorSkeleton ref={calc} className={s.calculatorSkeleton} />
  //     </>
  //   )
  // }

  return (
    <>
      {isAdjusting && <TaskModalActionsSkeleton />}
      <TaskModalActions
        props={props}
        refs={refs}
        modals={modals}
        className={clsx(isAdjusting && s.adjusting)}
      />

      {isAdjusting && <CalculatorSkeleton className={s.calculatorSkeleton} />}
      {isEnabled && isOpen && (
        <Calculator
          className={clsx(isAdjusting && s.adjusting)}
          ref={calc}
          global={props.deps.global}
          onInput={handleInput}
        />
      )}
    </>
  )
}
