import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useMemo, useState } from 'react'

import { StoryPhoneFrame } from '@/lib/storybook/story-phone-frame'
import { useStore } from '@/modules/task-modal/model/store/task-modal-store'
import { TaskModalProviders } from '@/modules/task-modal/providers'
import {
  makeTrainerProps,
  resetTrainerSession,
} from '@/modules/tasks/ui/templates/text/lib/storybook/make-trainer-props'
import type { TextTask } from '@/modules/tasks/ui/templates/text/lib/types.task'
import fixture from '@/modules/tasks/ui/templates/text/ui/plain/data/task.json'

import { Chat } from './chat'

const task = fixture as unknown as TextTask

const ChatStoryHost = () => {
  const props = useMemo(() => makeTrainerProps(task), [])
  const [ready, setReady] = useState(false)
  const activeTask = useStore((s) => s.state?.activeTask)

  useEffect(() => {
    resetTrainerSession(task)
    setReady(true)
    return () => {
      useStore.setState({
        state: null,
        answer: '',
        prevAnswer: null,
        isTaskLoaded: false,
        isAnswerChanged: false,
        isTransitioning: false,
        availableTasks: null,
      })
    }
  }, [])

  if (!ready || !activeTask) return null

  return (
    <TaskModalProviders>
      <StoryPhoneFrame>
        <Chat props={{ ...props, activeTask }} onClose={() => undefined} />
      </StoryPhoneFrame>
    </TaskModalProviders>
  )
}

const meta = {
  title: 'Chat/Chat',
  parameters: {
    layout: 'fullscreen',
    noPadding: true,
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ChatStoryHost />,
}
