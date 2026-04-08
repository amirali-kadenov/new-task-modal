import clsx from 'clsx'
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
  lastFocusedInput,
  modals,
  isAdjusting,
}: Props) => {
  const { actions, calc } = refs
  const { isEnabled, isOpen } = calcState

  const isTaskLoaded = useStore((s) => s.isTaskLoaded)
  const setIsTaskLoaded = useStore((s) => s.setIsTaskLoaded)

  const handleInput = (symbol: string) => {
    const map = refs.mathInput.current
    if (!map) return

    const input = map.get(lastFocusedInput.current?.id ?? '')
    input?.insertSymbol(symbol)
  }

  window.setLoadingFalse = () => setIsTaskLoaded(false)
  window.setLoadingTrue = () => setIsTaskLoaded(true)

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
