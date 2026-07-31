import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { createTextMessage } from '@/modules/chat/model/helpers'
import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'
import { runPlayStep } from '@/testing/play-step'
import { withTrackedPlay } from '@/testing/with-tracked-play'
import type { MessageInterface } from '@/types/api/api'

import { Message } from '../message/message'

import { ChatInput } from './chat-input'

/** Shared deps stub for ChatInput stories and portable-story unit tests. */
export const chatInputDeps = {
  global: {
    getUser: () => ({
      id: 1,
      firstname: 'Айгуль',
      surname: 'Ментор',
    }),
  },
} as TaskModalDependencies

const ChatInputHost = () => {
  const [messages, setMessages] = useState<MessageInterface[]>([])
  const user = chatInputDeps.global.getUser()

  const append = (message: MessageInterface) => {
    setMessages((prev) => [
      ...prev,
      { ...message, id: Date.now() + prev.length },
    ])
  }

  const handleSend = (text: string) => {
    append(createTextMessage(text, user))
  }

  const handleAddMessage = (message: MessageInterface) => {
    append(message)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        minHeight: 320,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          gap: 12,
          justifyContent: 'flex-end',
        }}
      >
        {messages.length === 0 ? (
          <p
            style={{
              margin: 0,
              color: 'var(--text-tertiary)',
              textAlign: 'center',
              fontSize: 13,
            }}
          >
            Отправьте текст, файл или голосовое — сообщения появятся здесь
          </p>
        ) : (
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}
      </div>
      <ChatInput
        deps={chatInputDeps}
        onSend={handleSend}
        onAddMessage={handleAddMessage}
      />
    </div>
  )
}

const PLAY_CASES = [
  { id: 'typeSend', label: 'Type and send text' },
  { id: 'cleared', label: 'Input cleared after send' },
] as const

const meta = {
  title: 'Chat/Input',
  component: ChatInput,
  parameters: {
    layout: 'padded',
    playCases: [...PLAY_CASES],
  },
  args: {
    deps: chatInputDeps,
    onSend: fn(),
    onAddMessage: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatInput>

export default meta
type Story = StoryObj<typeof meta>

/** Args-based story — source of truth for unit (`composeStories`) and play. */
export const Default: Story = {
  play: withTrackedPlay([...PLAY_CASES], async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Cообщение...')

    await runPlayStep('typeSend', 'Type and send text', async () => {
      await userEvent.type(input, 'привет')
      await userEvent.click(canvas.getAllByRole('button').at(-1)!)
      await expect(args.onSend).toHaveBeenCalledWith('привет')
    })

    await runPlayStep('cleared', 'Input cleared after send', async () => {
      await expect(input).toHaveValue('')
    })
  }),
}

/** Manual playground with a local message list (excluded from storybook vitest). */
export const Playground: Story = {
  tags: ['!test'],
  render: () => <ChatInputHost />,
}
