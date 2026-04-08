import { Activity } from 'react'

interface ActivityWrapperProps {
  children: React.ReactNode
  visible: boolean
}

export const ReactActivity = ({ children, visible }: ActivityWrapperProps) => {
  return <Activity mode={visible ? 'visible' : 'hidden'}>{children}</Activity>
}
