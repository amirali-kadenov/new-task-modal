import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'

import { RadioButton } from './radio-button'

const meta = {
  title: 'UI/RadioButton',
  component: RadioButton,
  parameters: {
    docs: {
      description: {
        component:
          'Одиночный radio с кастомным индикатором. Обычно используется через RadioButtonGroup.',
      },
    },
  },
  args: {
    name: 'demo',
    value: 'a',
    label: 'Вариант A',
    checked: false,
    onChange: fn(),
  },
} satisfies Meta<typeof RadioButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: {
    checked: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const CheckedDisabled: Story = {
  name: 'Checked disabled',
  args: {
    checked: true,
    disabled: true,
  },
}

export const ReadOnly: Story = {
  name: 'Read only',
  args: {
    readOnly: true,
  },
}

export const CheckedReadOnly: Story = {
  name: 'Checked read only',
  args: {
    checked: true,
    readOnly: true,
  },
}

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Клик переключает checked через локальный state.',
      },
    },
  },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked)
    return (
      <RadioButton
        {...args}
        checked={checked}
        onChange={(e) => {
          setChecked(e.target.checked)
          args.onChange(e)
        }}
      />
    )
  },
}
