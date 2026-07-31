import { useEffect, useRef, type ReactNode } from 'react'

import { ChatLayoutSkeleton } from './chat-layout-skeleton'
import s from './chat-layout.module.scss'

interface Props {
  isLoading?: boolean
  messageNodes: ReactNode[]
  messageKeys: number[]
  children: ReactNode
}

export const ChatLayout = ({
  isLoading,
  messageNodes,
  messageKeys,
  children,
}: Props) => {
  const messagesListRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const list = messagesListRef.current
    if (!list) return

    // Scroll only the messages list — not ancestors / the document
    // (scrollIntoView would jump Storybook docs to the chat story).
    list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' })
  }, [messageNodes.length])

  return (
    <div className={s.body}>
      {isLoading ? (
        <ChatLayoutSkeleton />
      ) : (
        <ul className={s.messages} ref={messagesListRef}>
          {messageNodes.map((node, index) => (
            <li className={s.item} key={messageKeys[index]}>
              {node}
            </li>
          ))}
        </ul>
      )}

      {children}
    </div>
  )
}
