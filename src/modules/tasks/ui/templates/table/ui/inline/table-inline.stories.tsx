import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  HIDDEN_TASK_ARGTYPES,
  STORY_DOCS,
  storyDocs,
  templateDocs,
} from '../../../shared/storybook/story-docs'
import {
  getGroupControlOptions,
  renderDefaultStory,
  renderWithSolutionStory,
  type TableStoryMetaArgs,
  type TemplateGroupFixture,
} from '../../lib/storybook'
import type { TableTask } from '../../lib/types.task'

import groupsJson from './data/groups.json'
import fixture from './data/task.json'
import readme from './README.md?raw'

import { TableInline as Template } from '.'

const task = fixture as unknown as TableTask
const groups = groupsJson as unknown as TemplateGroupFixture[]
const { groupIds, defaultGroup } = getGroupControlOptions(groups)

const ROOT_TITLE = 'Templates/Table/inline'

const meta = {
  title: 'Templates/Table/inline',
  component: Template,
  args: {
    group: defaultGroup,
  },
  argTypes: {
    ...HIDDEN_TASK_ARGTYPES,
    group: {
      control: 'select',
      options: groupIds,
      description:
        'Structural group из data/groups.json (`all` — все в AllGroups)',
    },
  },
  parameters: templateDocs(readme),
} satisfies Meta<TableStoryMetaArgs>

export default meta
type Story = StoryObj<TableStoryMetaArgs>

export const Default: Story = {
  parameters: storyDocs(STORY_DOCS.default),
  argTypes: {
    group: { options: groupIds },
  },
  render: ({ group }) =>
    renderDefaultStory({
      Template,
      groups,
      fallbackTask: task,
      group,
      rootTitle: ROOT_TITLE,
    }),
}

export const WithSolution: Story = {
  parameters: storyDocs(STORY_DOCS.withSolution),
  argTypes: {
    group: { options: groupIds },
  },
  render: ({ group }) =>
    renderWithSolutionStory({
      Template,
      groups,
      fallbackTask: task,
      group,
    }),
}
