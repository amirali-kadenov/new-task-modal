import type { Meta, StoryObj } from '@storybook/react-vite'

import EditIcon from '@/assets/icons/canvas/edit.svg'

import { Button, ButtonColor, ButtonLayout, ButtonSize } from './button'

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Кнопка действий: цвета Blue / Gray / White, layout Text или Icon, размеры Small и SizeIcon.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: Object.values(ButtonColor),
    },
    layout: {
      control: 'select',
      options: Object.values(ButtonLayout),
    },
    size: {
      control: 'select',
      options: Object.values(ButtonSize),
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Проверить',
    color: ButtonColor.Blue,
  },
}

export const Gray: Story = {
  args: {
    children: 'Отмена',
    color: ButtonColor.Gray,
  },
}

export const White: Story = {
  args: {
    children: 'Вторичная',
    color: ButtonColor.White,
  },
}

export const Small: Story = {
  args: {
    children: 'Маленькая',
    color: ButtonColor.Blue,
    size: ButtonSize.Small,
  },
}

export const Icon: Story = {
  args: {
    children: <EditIcon />,
    color: ButtonColor.White,
    layout: ButtonLayout.Icon,
    size: ButtonSize.SizeIcon,
  },
}

export const IconBlue: Story = {
  name: 'Icon / Blue',
  args: {
    children: <EditIcon />,
    color: ButtonColor.Blue,
    layout: ButtonLayout.Icon,
    size: ButtonSize.SizeIcon,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Недоступно',
    color: ButtonColor.Blue,
    disabled: true,
  },
}

export const DisabledGray: Story = {
  name: 'Disabled / Gray',
  args: {
    children: 'Недоступно',
    color: ButtonColor.Gray,
    disabled: true,
  },
}

export const AllColors: Story = {
  name: 'All colors',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button color={ButtonColor.Blue}>Blue</Button>
      <Button color={ButtonColor.Gray}>Gray</Button>
      <Button color={ButtonColor.White}>White</Button>
      <Button color={ButtonColor.Blue} size={ButtonSize.Small}>
        Small
      </Button>
      <Button color={ButtonColor.Blue} disabled>
        Disabled
      </Button>
    </div>
  ),
}
