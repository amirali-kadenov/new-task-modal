import { useEffect, type ComponentType } from 'react'

import { useStore } from '@/modules/task-modal/model/store/task-modal-store'

export const withTaskLoading = <T extends object>(
  Template: ComponentType<T>,
) => {
  const Component = (props: T) => {
    const setIsTaskLoaded = useStore((s) => s.setIsTaskLoaded)

    useEffect(() => {
      setIsTaskLoaded(true)
      return () => {
        setIsTaskLoaded(false)
      }
    }, [setIsTaskLoaded])

    return <Template {...props} />
  }

  return Component
}
