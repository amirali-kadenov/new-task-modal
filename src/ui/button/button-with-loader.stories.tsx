import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { ButtonColor, ButtonLayout, ButtonSize } from './button'
import { ButtonWithLoader } from './button-with-loader'

const meta = {
  title: 'UI/ButtonWithLoader',
  component: ButtonWithLoader,
  parameters: {
    docs: {
      description: {
        component:
          'Кнопка с индикатором загрузки: при `isLoading` сохраняет размер, скрывает текст и показывает спиннер, кнопка disabled.',
      },
    },
  },
} satisfies Meta<typeof ButtonWithLoader>

export default meta
type Story = StoryObj<typeof meta>

/** Default: click starts loading, then resets after a short delay. */
export const Default: Story = {
  args: {
    children: 'Проверить',
    color: ButtonColor.Blue,
    isLoading: false,
  },
  render: function Render(args) {
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = () => {
      setIsLoading(true)
      window.setTimeout(() => setIsLoading(false), 1500)
    }

    return (
      <ButtonWithLoader {...args} isLoading={isLoading} onClick={handleClick} />
    )
  },
}

export const Idle: Story = {
  args: {
    children: 'Проверить',
    color: ButtonColor.Blue,
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    children: 'Проверить',
    color: ButtonColor.Blue,
    isLoading: true,
  },
}

export const LoadingSmall: Story = {
  name: 'Loading / Small',
  args: {
    children: 'Проверить',
    color: ButtonColor.Blue,
    size: ButtonSize.Small,
    isLoading: true,
  },
}

export const IdleGray: Story = {
  name: 'Idle / Gray',
  args: {
    children: 'Отмена',
    color: ButtonColor.Gray,
    isLoading: false,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Проверить',
    color: ButtonColor.Blue,
    isLoading: false,
    disabled: true,
  },
}

export const IconIdle: Story = {
  name: 'Icon / Idle',
  args: {
    children: '→',
    color: ButtonColor.Blue,
    layout: ButtonLayout.Icon,
    size: ButtonSize.SizeIcon,
    isLoading: false,
  },
}
