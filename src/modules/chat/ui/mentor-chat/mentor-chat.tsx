import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import type { TaskModalProps } from '@/modules/task-modal/model/types/props'
import type {
  ChatMessageType,
  MessageInterface,
  TextMessage,
} from '@/types/api/api'

import { getFileType, insertDateMarkers } from '../../model/helpers'
import { ChatLayout } from '../common/chat-layout/chat-layout'
import { ChatInput } from '../common/input/chat-input'
import { DateMessage } from '../common/message/date/date-message'
import { Message } from '../common/message/message'

interface Props {
  props: TaskModalProps
}

export const MentorChat = ({ props }: Props) => {
  const { deps } = props
  const { socket, socketController } = deps
  const queryClient = useQueryClient()
  const [isSending, setIsSending] = useState(false)
  const currentUserId = deps.global.getUserId()

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chatMessages', currentUserId],
    queryFn: () =>
      deps.api.getLastChatMessages(undefined, true).then((response) => {
        const data = response as { messages: MessageInterface[] }
        return data.messages.map((message) => ({
          ...message,
          isFromPupil: message.senderUserId === currentUserId,
        }))
      }),
  })
  // console.log('MENTOR CHAT, messages', { messages, isLoading })

  const subscribeToEvents = () => {
    const socketEvents = [
      {
        when: 'new_chat_message_added',
        execute: (message: TextMessage) => {
          const updatedMessage = {
            ...message,
            isFromPupil: message.senderUserId === currentUserId,
          }

          queryClient.setQueryData<MessageInterface[]>(
            ['chatMessages', currentUserId],
            (prevState) => {
              if (!prevState) return [updatedMessage]
              const messageExists = prevState.some((m) => m.id === message.id)
              if (messageExists) return prevState

              return [...prevState, updatedMessage]
            },
          )

          if (!message.isFromPupil) {
            // deps.alert.showInfoMessage(message.text as string)
          }
        },
      },
      {
        when: 'new_chat_messages_are_read',
        execute: () => {
          queryClient.setQueryData<MessageInterface[]>(
            ['chatMessages', currentUserId],
            (prevState) =>
              (prevState || []).map((it) => ({
                ...it,
                isUnread: false,
              })),
          )
        },
      },
    ]

    socketController.joinToRoom(
      socket,
      socketController.currentPupilRoom(),
      socketEvents,
    )
  }

  const sendMessage = async (
    messageText: string,
    messageType: ChatMessageType = 'text',
  ) => {
    if (!messageText.trim() || isSending) return

    try {
      setIsSending(true)
      const response = await deps.api.sendChatMessage(messageText, messageType)
      console.log('send message response', { response })
    } catch (error) {
      console.error(error)
      deps.alert.showError(error)
    } finally {
      setIsSending(false)
    }
  }

  const handleAddMessage = (message: MessageInterface) => {
    // const messageText = message.type === 'file' ? message.fileUrl

    // sendMessage(message.text, message.type)
    queryClient.setQueryData<MessageInterface[]>(
      ['chatMessages', currentUserId],
      (prevState) => {
        if (!prevState) return [message]
        return [...prevState, message]
      },
    )
  }

  const useMediaApi = Boolean(deps.featureFlags?.useMentorChatMediaApi)

  const sendMedia = async (data: Blob | File, type: ChatMessageType) => {
    if (isSending) return

    try {
      setIsSending(true)
      await deps.api.sendChatMessage(data, type)
    } catch (error) {
      console.error(error)
      deps.alert.showError(error)
    } finally {
      setIsSending(false)
    }
  }

  const handleAddFile = (file: File) => {
    const type = getFileType(file) as ChatMessageType
    sendMedia(file, type)
  }

  const handleAddVoice = (blob: Blob) => {
    sendMedia(blob, 'audio')
  }

  useEffect(() => {
    subscribeToEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const messagesWithDates = insertDateMarkers(messages)

  const messageNodes = messagesWithDates.map((message) => {
    if (message.type === 'date-marker') {
      return <DateMessage key={message.id} date={message.date} />
    }
    return <Message key={message.id} message={message} />
  })

  return (
    <ChatLayout
      messageNodes={messageNodes}
      messageKeys={messagesWithDates.map((m) => m.id)}
      isLoading={isLoading}
    >
      <ChatInput
        onSend={sendMessage}
        onAddMessage={handleAddMessage}
        deps={props.deps}
        onAddFile={useMediaApi ? handleAddFile : undefined}
        onAddVoice={useMediaApi ? handleAddVoice : undefined}
      />
    </ChatLayout>
  )
}
