import { useEffect, useEffectEvent, useState } from 'react'

import { getAvailableTasks } from '@/modules/tasks/lib/get-available-tasks'

import { useSetAppState, useStore } from '../store/task-modal-store'
import type { TaskModalProps } from '../types/props'

const availableTasks = getAvailableTasks()

export const useInitialSetup = (props: TaskModalProps) => {
  const [isSetupDone, setIsSetupDone] = useState(false)

  const setState = useSetAppState()
  const setAvailableTasks = useStore((s) => s.setAvailableTasks)

  const initialSetup = useEffectEvent(() => {
    void (async () => {
      setAvailableTasks(await availableTasks)
      setState(props.state)
      setIsSetupDone(true)
    })()
  })

  useEffect(() => {
    initialSetup()
  }, [])

  return isSetupDone
}
