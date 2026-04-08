import type { TaskModalProps } from '@/modules/task-modal/model/types/props'
import { Tabs } from '@/ui/tabs/tabs'
import { TopBar } from '@/ui/top-bar/top-bar'

import s from './chat.module.scss'
import { AiChat } from './ui/ai-chat/ai-chat'
import { MentorChat } from './ui/mentor-chat/mentor-chat'

export interface ChatProps {
  onClose: () => void
  props: TaskModalProps
}

export const Chat = ({ props, onClose }: ChatProps) => {
  const tabs = [
    {
      title: 'AI-чат',
      subtitle: '24/7',
      content: () => <AiChat props={props} />,
    },
    {
      title: 'Ментор',
      subtitle: '10 — 23',
      content: () => <MentorChat props={props} />,
    },
  ]

  return (
    <div className={s.chat}>
      <TopBar titleClassName={s.title} deps={props.deps} onClose={onClose}>
        AI-чат
      </TopBar>

      <Tabs tabs={tabs} />
    </div>
  )
}
