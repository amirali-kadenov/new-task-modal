import { Controls, Primary } from '@storybook/addon-docs/blocks'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { isAutomatedInteractionRun } from '@/testing/with-on-demand-play'

import { runTrainerSuite } from './lib/run-trainer-suites'
import { TRAINER_VARIANTS } from './lib/trainer-variants'
import {
  defaultTrainerArgs,
  TrainerPlayground,
  type TrainerPlaygroundArgs,
} from './ui/trainer-playground'
import { TrainerTestRunner } from './ui/trainer-test-runner'

/** Docs without <Stories /> — one Default instance (shared store cannot host two). */
const TrainerDocsPage = () => (
  <>
    <h1>Trainer</h1>
    <p>
      Один инстанс playground (общий store). Отдельные состояния — в Canvas:
      Idle, WrongAnswer, Hint, Solution, VideoExplanation, CanvasAndChat.
    </p>
    <Primary />
    <Controls />
  </>
)

const meta = {
  title: 'Trainer/Trainer',
  component: TrainerPlayground,
  parameters: {
    layout: 'fullscreen',
    noPadding: true,
    docs: {
      page: TrainerDocsPage,
    },
  },
  args: defaultTrainerArgs(),
  argTypes: {
    variantKey: {
      control: 'select',
      options: TRAINER_VARIANTS.map((v) => v.key),
      description: 'Template from TRAINER_VARIANTS (also toolbar)',
    },
    group: {
      control: 'text',
      description: 'Structural group id (also via toolbar select)',
    },
    showAllStates: { table: { disable: true } },
    stateTab: { table: { disable: true } },
  },
} satisfies Meta<typeof TrainerPlayground>

export default meta
type Story = StoryObj<TrainerPlaygroundArgs>

/** All States tabs — UI only (also the sole story on Docs). No play. */
export const Default: Story = {
  render: (args) => <TrainerPlayground {...args} showAllStates />,
}

export const Idle: Story = {
  tags: ['!autodocs'],
  render: (args) => <TrainerPlayground {...args} stateTab="idle" />,
}

export const WrongAnswer: Story = {
  tags: ['!autodocs'],
  render: (args) => <TrainerPlayground {...args} stateTab="wrong" />,
}

export const Hint: Story = {
  tags: ['!autodocs'],
  render: (args) => <TrainerPlayground {...args} stateTab="hint" />,
}

export const Solution: Story = {
  tags: ['!autodocs'],
  render: (args) => <TrainerPlayground {...args} stateTab="solution" />,
}

export const VideoExplanation: Story = {
  tags: ['!autodocs'],
  render: (args) => <TrainerPlayground {...args} stateTab="videoExplanation" />,
}

export const CanvasAndChat: Story = {
  tags: ['!autodocs'],
  render: (args) => <TrainerPlayground {...args} stateTab="canvasChat" />,
}

/**
 * Vitest-only toolbar checks (task select + launch links).
 * Excluded from Docs so Default stays calm.
 */
export const ToolbarChecks: Story = {
  tags: ['!autodocs'],
  parameters: {
    skipRunPlayButton: true,
  },
  render: (args) => <TrainerPlayground {...args} showAllStates />,
  play: async ({ canvasElement }) => {
    if (!isAutomatedInteractionRun()) return

    const canvas = within(canvasElement)
    const taskSelect = await canvas.findByTestId('trainer-task-select')
    await expect(taskSelect).toBeInTheDocument()
    await expect(taskSelect.querySelectorAll('option').length).toBeGreaterThan(
      0,
    )

    const groupSelect = canvas.getByTestId('trainer-group-select')
    const groupOptions = [...groupSelect.querySelectorAll('option')].map(
      (o) => o.value,
    )
    if (groupOptions.length > 1) {
      const nextGroup =
        groupOptions.find((id) => id !== groupSelect.value) ?? groupOptions[1]
      const beforeTasks = [...taskSelect.querySelectorAll('option')].map(
        (o) => o.value,
      )

      await userEvent.selectOptions(groupSelect, nextGroup)

      await waitFor(async () => {
        const afterSelect = canvas.getByTestId('trainer-task-select')
        const afterTasks = [...afterSelect.querySelectorAll('option')].map(
          (o) => o.value,
        )
        await expect(afterTasks).not.toEqual(beforeTasks)
      })
    }

    const newLink = canvas.getByRole('link', { name: 'Новый тренажёр' })
    const oldLink = canvas.getByRole('link', { name: 'Старый тренажёр' })
    await expect(newLink).toHaveAttribute(
      'href',
      expect.stringContaining('chapterId='),
    )
    await expect(oldLink).toHaveAttribute(
      'href',
      expect.stringContaining('old=true'),
    )
  },
}

/**
 * Interactive suite runner (buttons + checklist).
 * Under Vitest, auto-runs the full suite (answer flows + canvas/chat).
 */
export const Tests: Story = {
  tags: ['!autodocs'],
  parameters: {
    // Runner has its own buttons; skip global "Run interaction" chrome.
    skipRunPlayButton: true,
  },
  render: (args) => <TrainerTestRunner {...args} />,
  play: async ({ canvasElement, args }) => {
    if (!isAutomatedInteractionRun()) return

    const stage =
      canvasElement.querySelector<HTMLElement>(
        '[data-testid="trainer-test-stage"]',
      ) ?? canvasElement

    // Cover answer flows and canvas/chat in CI (suite `all`).
    const results = await runTrainerSuite('all', {
      canvasElement: stage,
      args: {
        variantKey: args.variantKey,
        group: args.group,
      },
    })

    const failed = results.filter((r) => r.status === 'fail')
    if (failed.length > 0) {
      throw new Error(
        failed.map((f) => `${f.label}: ${f.error ?? 'failed'}`).join('\n'),
      )
    }
  },
}
