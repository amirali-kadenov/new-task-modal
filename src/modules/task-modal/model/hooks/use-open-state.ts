import { useState } from 'react'

export type OpenState = ReturnType<typeof useOpenState>

export const useOpenState = () => {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return { isOpen, open, close }
}
