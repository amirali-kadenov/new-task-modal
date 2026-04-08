import { useEffect, useRef, useState } from 'react'

import type { Task } from '@/types/api/task'

import { TASK_DESCRIPTIONS_WITHOUT_CALC } from '../../constants'
import { useStore } from '../../store/task-modal-store'
import { useOpenState } from '../use-open-state'

import { handleCalcOverflow } from './get-calc-overflow-handler'
import type { TaskModalRefs } from './use-refs'

interface Args {
  refs: TaskModalRefs
  activeTask: Task
}

export const useCalcSetup = ({ activeTask, refs }: Args) => {
  const isTaskLoaded = useStore((s) => s.isTaskLoaded)
  const calc = useOpenState()
  const [isCalcEnabled, setIsCalcEnabled] = useState(false)

  const [finishedTaskId, setFinishedTaskId] = useState<string | null>(null)

  const [setupTrigger, setSetupTrigger] = useState(0)

  const setupTriggerRef = useRef<string | null>(null)

  // Effect 1: Determine if calculator should be enabled for this task type
  useEffect(() => {
    if (!isTaskLoaded) return

    if (isWithoutCalc(activeTask)) {
      calc.close()
      setIsCalcEnabled(false)
      setFinishedTaskId(activeTask.id)
    } else {
      calc.open()
      setIsCalcEnabled(true)
      setSetupTrigger((prev) => prev + 1)
    }
  }, [activeTask.id, isTaskLoaded])

  // Effect 2: Only for tasks with calc enabled. Close calc if there is overflow in task container. Set up event listeners once DOM refs are available
  useEffect(() => {
    if (setupTrigger === 0) return

    const removeEventListener = handleCalcOverflow({ refs, calc })

    setFinishedTaskId(activeTask.id)

    return removeEventListener
  }, [setupTrigger])

  // Derive whether setup is finished during render phase to avoid the 1-frame stale state
  const isSetupFinished = finishedTaskId === activeTask.id

  return {
    isOpen: calc.isOpen,
    isEnabled: isCalcEnabled,
    isSetupFinished,
  }
}

export type CalcState = ReturnType<typeof useCalcSetup>

const isWithoutCalc = (task: Task) =>
  TASK_DESCRIPTIONS_WITHOUT_CALC.includes(task.description.type)
