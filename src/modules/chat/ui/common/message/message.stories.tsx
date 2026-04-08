import type { Meta, StoryObj } from '@storybook/react'

import '@/styles/_index.scss'
import { Message } from './message'

const meta: Meta<typeof Message> = {
  component: Message,
  title: 'Modules/Chat/Message',
  argTypes: {
    message: {
      control: 'object',
    },
  },
}

export default meta
type Story = StoryObj<typeof Message>

export const Text: Story = {
  args: {
    message: {
      id: 1,
      type: 'text',
      text: 'Hello world! This is a text message.',
      senderFullname: 'Recipient',
      sentAt: new Date().toISOString(),
      isFromPupil: false,
    },
  },
}

export const Image: Story = {
  args: {
    message: {
      id: 2,
      type: 'image',
      imageUrl: 'https://picsum.photos/300/340',
      senderFullname: 'Recipient',
      sentAt: new Date().toISOString(),
      isFromPupil: false,
    },
  },
}

export const Video: Story = {
  args: {
    message: {
      id: 3,
      type: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://picsum.photos/300/340',
      duration: 120,
      senderFullname: 'Sender',
      sentAt: new Date().toISOString(),
      isFromPupil: true,
    },
  },
}

export const Audio: Story = {
  args: {
    message: {
      id: 4,
      type: 'audio',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      duration: 360,
      senderFullname: 'Recipient',
      sentAt: new Date().toISOString(),
      isFromPupil: false,
    },
  },
}

export const File: Story = {
  args: {
    message: {
      id: 5,
      type: 'file',
      fileName: 'document.pdf',
      fileSize: 1024 * 1024 * 2.5,
      fileType: 'pdf',
      fileUrl: '#',
      senderFullname: 'Sender',
      sentAt: new Date().toISOString(),
      isFromPupil: true,
    },
  },
}
