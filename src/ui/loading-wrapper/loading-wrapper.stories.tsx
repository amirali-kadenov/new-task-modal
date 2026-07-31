import type { Meta, StoryObj } from '@storybook/react-vite'

import { Loader } from '../loader/loader'

import { LoadingWrapper } from './loading-wrapper'

const meta = {
  title: 'UI/LoadingWrapper',
  component: LoadingWrapper,
  parameters: {
    docs: {
      description: {
        component:
          'Пока `isLoading`, показывает loader и невидимо резервирует место под children. С `fitContent` обёртка сжимается по контенту.',
      },
    },
  },
} satisfies Meta<typeof LoadingWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: {
    isLoading: true,
    loader: Loader,
    children: <div style={{ padding: 16 }}>Контент загружен</div>,
  },
}

export const Loaded: Story = {
  args: {
    isLoading: false,
    loader: Loader,
    children: <div style={{ padding: 16 }}>Контент загружен</div>,
  },
}

export const FitContentLoading: Story = {
  name: 'Fit content / Loading',
  args: {
    isLoading: true,
    fitContent: true,
    loader: Loader,
    children: (
      <div style={{ padding: 16, width: 200 }}>Узкий блок контента</div>
    ),
  },
}

export const TallContent: Story = {
  name: 'Tall content / Loading',
  args: {
    isLoading: true,
    loader: Loader,
    children: (
      <div style={{ padding: 16, minHeight: 160 }}>
        Высокий контент — место под него резервируется
      </div>
    ),
  },
}
