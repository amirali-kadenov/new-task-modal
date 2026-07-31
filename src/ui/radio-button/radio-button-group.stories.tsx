import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { RadioButtonGroup } from './radio-button-group'

const meta = {
  title: 'UI/RadioButtonGroup',
  component: RadioButtonGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Группа radio для взаимоисключающего выбора. Поддерживает disabled на опции и на всей группе.',
      },
    },
  },
} satisfies Meta<typeof RadioButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

const OPTIONS = [
  { value: 'a', label: 'Вариант A' },
  { value: 'b', label: 'Вариант B' },
  { value: 'c', label: 'Вариант C', disabled: true },
]

export const Default: Story = {
  args: {
    name: 'demo',
    options: OPTIONS,
    onChange: () => undefined,
    ariaLabel: 'Выбор варианта',
  },
  render: function Render(args) {
    const [value, setValue] = useState('a')
    return <RadioButtonGroup {...args} value={value} onChange={setValue} />
  },
}

export const Unselected: Story = {
  args: {
    name: 'unselected',
    options: OPTIONS,
    onChange: () => undefined,
    ariaLabel: 'Без выбора',
  },
  render: function Render(args) {
    const [value, setValue] = useState('')
    return <RadioButtonGroup {...args} value={value} onChange={setValue} />
  },
}

export const GroupDisabled: Story = {
  name: 'Group disabled',
  args: {
    name: 'disabled-group',
    options: OPTIONS,
    value: 'a',
    disabled: true,
    onChange: () => undefined,
    ariaLabel: 'Группа недоступна',
  },
}

export const GroupReadOnly: Story = {
  name: 'Group read only',
  args: {
    name: 'readonly-group',
    options: OPTIONS.map(({ value, label }) => ({ value, label })),
    value: 'a',
    readOnly: true,
    onChange: () => undefined,
    ariaLabel: 'Режим просмотра',
  },
}

export const TwoOptions: Story = {
  name: 'Two options',
  args: {
    name: 'two',
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Нет' },
    ],
    onChange: () => undefined,
    ariaLabel: 'Да или нет',
  },
  render: function Render(args) {
    const [value, setValue] = useState('yes')
    return <RadioButtonGroup {...args} value={value} onChange={setValue} />
  },
}
