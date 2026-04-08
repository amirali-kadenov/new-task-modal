import { ReactActivity } from '@/lib/wrappers/react-activity'

import { Canvas } from '../canvas/canvas'
import { Chat } from '../chat/chat'

import { useInitialSetup } from './model/hooks/use-initial-setup'
import { useOpenState, type OpenState } from './model/hooks/use-open-state'
import type { TaskModalProps } from './model/types/props'
import { TaskModalProviders } from './providers'
import { TaskModalContent } from './ui/content/content'

export interface TaskModalModals {
  chat: OpenState
  canvas: OpenState
}

export const TaskModal = (props: TaskModalProps) => {
  const chat = useOpenState()
  const canvas = useOpenState()
  const isSetupDone = useInitialSetup(props)

  if (!isSetupDone) return null

  return (
    <>
      <TaskModalProviders>
        <TaskModalContent props={props} modals={{ chat, canvas }} />

        <ReactActivity visible={canvas.isOpen}>
          <Canvas onClose={canvas.close} />
        </ReactActivity>

        <ReactActivity visible={chat.isOpen}>
          <Chat props={props} onClose={chat.close} />
        </ReactActivity>
      </TaskModalProviders>
    </>
  )
}
