import { useState } from 'react'

export type OpenState = ReturnType<typeof useOpenState>

export const useOpenState = (initial = false) => {
  const [isOpen, setIsOpen] = useState(initial)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return { isOpen, open, close }
}
