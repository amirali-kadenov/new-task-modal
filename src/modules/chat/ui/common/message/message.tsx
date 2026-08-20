import type { MessageInterface } from '@/types/api/api'

import FileMessage from './file-new/file-new'
import ImageMessage from './image/image'
import { MessageContainer } from './message-container'
import { MessageTime } from './message-time'
import { TextMessage } from './text/text'
import VideoMessage from './video/video'
import VoiceMessage from './voice/voice'

interface Props {
  message: MessageInterface
}

export const Message = ({ message }: Props) => {
  switch (message.type) {
    case 'audio':
      return (
        <MessageContainer isFromPupil={message.isFromPupil}>
          <VoiceMessage
            audioUrl={message.audioUrl}
            duration={message.duration}
          />
          <MessageTime sentAt={message.sentAt} />
        </MessageContainer>
      )
    case 'image':
      return (
        <ImageMessage
          imageUrl={message.fileUrl}
          isFromPupil={message.isFromPupil}
          sentAt={message.sentAt}
        />
      )
    case 'video':
      return (
        <VideoMessage
          duration={message.duration}
          isFromPupil={message.isFromPupil}
          sentAt={message.sentAt}
          thumbnailUrl={message.thumbnailUrl}
          videoUrl={message.fileUrl}
        />
      )
    case 'file':
      return (
        <MessageContainer isFromPupil={message.isFromPupil}>
          <FileMessage
            fileName={message.fileName}
            fileSize={message.fileSize}
            fileUrl={message.fileUrl}
          />
          <MessageTime sentAt={message.sentAt} />
        </MessageContainer>
      )
    default:
      return (
        <MessageContainer isFromPupil={message.isFromPupil}>
          <TextMessage
            text={message.text}
            isFromPupil={message.isFromPupil}
            senderFullname={message.senderFullname}
          />
          <MessageTime sentAt={message.sentAt} />
        </MessageContainer>
      )
  }
}
