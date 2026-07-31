import type { Meta, StoryObj } from '@storybook/react-vite'

import AttachIcon from '@/assets/icons/chat/attach.svg'
import MicrophoneIcon from '@/assets/icons/chat/microphone.svg'

import { InputWithIcons } from './input-with-icons'

const leftIcon = <AttachIcon width={20} height={20} />
const rightIcon = <MicrophoneIcon width={20} height={20} />

const meta = {
  title: 'UI/InputWithIcons',
  component: InputWithIcons,
  parameters: {
    docs: {
      description: {
        component:
          'Текстовый инпут с опциональными иконками слева и/или справа. Иконки позиционируются поверх поля, у инпута добавляются внутренние отступы.',
      },
    },
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputWithIcons>

export default meta
type Story = StoryObj<typeof meta>

export const Left: Story = {
  args: {
    placeholder: 'С иконкой слева',
    leftIcon,
  },
}

export const Right: Story = {
  render: () => (
    <InputWithIcons placeholder="С иконкой справа" rightIcon={rightIcon} />
  ),
}

export const Both: Story = {
  render: () => (
    <InputWithIcons
      placeholder="С обеих сторон"
      leftIcon={leftIcon}
      rightIcon={rightIcon}
    />
  ),
}

export const WithValue: Story = {
  name: 'With value',
  args: {
    defaultValue: 'Сообщение ученику',
    leftIcon,
    rightIcon,
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Недоступно',
    leftIcon,
    rightIcon,
    disabled: true,
  },
}

export const Empty: Story = {
  name: 'Empty (no icons)',
  args: {
    placeholder: 'Без иконок',
  },
}
