import { useRef } from 'react'

import type { MathInputRef } from '@/ui/math-input/types'

export const useTaskModalRefs = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const calcRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const taskContRef = useRef<HTMLDivElement>(null)
  const mathInputRef = useRef<Map<string, MathInputRef> | null>(null)

  const refs = {
    root: rootRef,
    header: headerRef,
    calc: calcRef,
    actions: actionsRef,
    taskContainer: taskContRef,
    mathInput: mathInputRef,
  }

  return refs
}

export type TaskModalRefs = ReturnType<typeof useTaskModalRefs>
