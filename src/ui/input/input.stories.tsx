import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from './input'
import inputStyles from './input.module.scss'

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          'Стилизованное текстовое поле: placeholder, значение, disabled и error через CSS-классы.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Введите ответ',
  },
}

export const WithValue: Story = {
  name: 'With value',
  args: {
    defaultValue: '42',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Недоступно',
    disabled: true,
    className: inputStyles.disabled,
  },
}

export const Error: Story = {
  args: {
    defaultValue: 'неверный ответ',
    className: inputStyles.error,
  },
}

export const ReadOnly: Story = {
  name: 'Read only',
  args: {
    defaultValue: 'Только чтение',
    readOnly: true,
  },
}
