import { useState, type KeyboardEvent } from 'react'

import SendIcon from '@/assets/icons/chat/send.svg'
import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import type { MessageInterface } from '@/types/api/api'
import { Button, ButtonLayout, ButtonSize } from '@/ui/button/button'
import { InputWithIcons } from '@/ui/input/input-with-icons'

import { createAudioMessage, createFileMessage } from '../../../model/helpers'

import { AudioInput } from './audio/audio'
import s from './chat-input.module.scss'
import { FileInput } from './file/file'

interface Props {
  onSend: (text: string) => void
  onAddMessage: (message: MessageInterface) => void
  deps: TaskModalDependencies
  onAddFile?: (file: File) => void
  onAddVoice?: (blob: Blob, recordingTime: number) => void
}

export const ChatInput = ({
  onSend,
  onAddMessage,
  deps,
  onAddFile,
  onAddVoice,
}: Props) => {
  const [isRecording, setIsRecording] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const sendMessage = () => {
    if (messageText.trim() === '') return
    onSend(messageText.trim())
    setMessageText('')
  }

  const tryToAddMessage = (message: MessageInterface) => {
    setIsSending(true)
    try {
      onAddMessage(message)
    } catch (error) {
      console.error('Error adding message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const user = deps.global.getUser()

  const addFileMessage = (file: File) => {
    if (onAddFile) {
      onAddFile(file)
      return
    }
    const fileMessage = createFileMessage(file, user)
    tryToAddMessage(fileMessage)
  }

  const addVoiceMessage = (blob: Blob, recordingTime: number) => {
    if (onAddVoice) {
      onAddVoice(blob, recordingTime)
      return
    }
    const audioMessage = createAudioMessage(blob, recordingTime, user)
    tryToAddMessage(audioMessage)
  }

  return (
    <div className={s.container}>
      {!isRecording && (
        <InputWithIcons
          name="message"
          value={messageText}
          placeholder="Cообщение..."
          disabled={isSending}
          containerClassName={s.inputContainer}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          leftIcon={
            <FileInput onAddFile={addFileMessage} disabled={isSending} />
          }
        />
      )}

      {messageText ? (
        <Button
          onClick={sendMessage}
          layout={ButtonLayout.Icon}
          size={ButtonSize.SizeIcon}
        >
          <SendIcon />
        </Button>
      ) : (
        <AudioInput
          onAddVoice={addVoiceMessage}
          disabled={isSending}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      )}
    </div>
  )
}
