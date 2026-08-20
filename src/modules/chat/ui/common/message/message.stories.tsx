import type { Meta, StoryObj } from '@storybook/react-vite'

import { DateMessage } from './date/date-message'
import { Message } from './message'
import { MessageContainer } from './message-container'
import { MessageSkeleton } from './message-skeleton'
import { MessageTime } from './message-time'
import { VoiceMessageSkeleton } from './voice/voice'

const IMAGE_URL = '/storybook-media/sample-image.jpg'
const VIDEO_URL = '/storybook-media/sample-video.mp4'
const AUDIO_URL = '/storybook-media/sample-audio.mp3'

const now = new Date()
const yesterday = new Date(now)
yesterday.setDate(yesterday.getDate() - 1)
const lastWeek = new Date(now)
lastWeek.setDate(lastWeek.getDate() - 7)

const base = {
  senderUserId: 1,
  sentAt: now.toISOString(),
} as const

type FromArgs = { isFromPupil: boolean }

type DateVariant = 'today' | 'yesterday' | 'older'

const dateByVariant: Record<DateVariant, Date> = {
  today: now,
  yesterday,
  older: lastWeek,
}

const sender = (isFromPupil: boolean) =>
  isFromPupil
    ? { senderFullname: 'Ученик', isFromPupil: true as const }
    : { senderFullname: 'Айгуль Ментор', isFromPupil: false as const }

const meta = {
  title: 'Chat/Message',
  component: Message,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isFromPupil: {
      control: 'boolean',
      description: 'Сообщение от ученика',
    },
  },
  args: {
    isFromPupil: false,
  },
} satisfies Meta

export default meta

type Story = StoryObj<FromArgs>

export const Text: Story = {
  render: ({ isFromPupil }) => (
    <Message
      message={{
        ...base,
        id: 1,
        type: 'text',
        text: isFromPupil
          ? 'Здравствуйте, у меня вопрос по задаче.'
          : 'Привет! Это текстовое сообщение от ментора.',
        ...sender(isFromPupil),
      }}
    />
  ),
}

export const Image: Story = {
  render: ({ isFromPupil }) => (
    <Message
      message={{
        ...base,
        id: 2,
        type: 'image',
        fileUrl: IMAGE_URL,
        ...sender(isFromPupil),
      }}
    />
  ),
}

export const Video: Story = {
  render: ({ isFromPupil }) => (
    <Message
      message={{
        ...base,
        id: 3,
        type: 'video',
        fileUrl: VIDEO_URL,
        thumbnailUrl: IMAGE_URL,
        duration: 10,
        ...sender(isFromPupil),
      }}
    />
  ),
}

export const Audio: Story = {
  render: ({ isFromPupil }) => (
    <Message
      message={{
        ...base,
        id: 4,
        type: 'audio',
        audioUrl: AUDIO_URL,
        duration: 3,
        ...sender(isFromPupil),
      }}
    />
  ),
}

export const AudioLoading: Story = {
  render: ({ isFromPupil }) => (
    <MessageContainer isFromPupil={isFromPupil}>
      <VoiceMessageSkeleton />
      <MessageTime sentAt={now.toISOString()} />
    </MessageContainer>
  ),
}

export const File: Story = {
  render: ({ isFromPupil }) => (
    <Message
      message={{
        ...base,
        id: 5,
        type: 'file',
        fileName: isFromPupil ? 'solution.pdf' : 'homework.pdf',
        fileSize: isFromPupil ? 512 * 1024 : 1024 * 1024 * 2.5,
        fileType: 'application/pdf',
        fileUrl: IMAGE_URL,
        ...sender(isFromPupil),
      }}
    />
  ),
}

export const Skeleton: Story = {
  render: ({ isFromPupil }) => <MessageSkeleton isFromPupil={isFromPupil} />,
}

export const DateLabel: StoryObj<{ variant: DateVariant }> = {
  name: 'Date',
  argTypes: {
    variant: {
      control: 'select',
      options: ['today', 'yesterday', 'older'],
    },
  },
  args: {
    variant: 'today',
  },
  render: ({ variant }) => <DateMessage date={dateByVariant[variant]} />,
}

export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DateMessage date={now} />
      <Message
        message={{
          ...base,
          id: 101,
          type: 'text',
          text: 'Сообщение от ментора',
          ...sender(false),
        }}
      />
      <Message
        message={{
          ...base,
          id: 102,
          type: 'text',
          text: 'Ответ ученика',
          ...sender(true),
        }}
      />
      <Message
        message={{
          ...base,
          id: 103,
          type: 'image',
          fileUrl: IMAGE_URL,
          ...sender(false),
        }}
      />
      <Message
        message={{
          ...base,
          id: 104,
          type: 'video',
          fileUrl: VIDEO_URL,
          thumbnailUrl: IMAGE_URL,
          duration: 10,
          ...sender(true),
        }}
      />
      <Message
        message={{
          ...base,
          id: 105,
          type: 'audio',
          audioUrl: AUDIO_URL,
          duration: 3,
          ...sender(false),
        }}
      />
      <Message
        message={{
          ...base,
          id: 106,
          type: 'file',
          fileName: 'document.pdf',
          fileSize: 1024 * 900,
          fileType: 'application/pdf',
          fileUrl: IMAGE_URL,
          ...sender(true),
        }}
      />
      <MessageSkeleton isFromPupil={false} />
      <MessageSkeleton isFromPupil />
      <DateMessage date={yesterday} />
      <DateMessage date={lastWeek} />
    </div>
  ),
}
